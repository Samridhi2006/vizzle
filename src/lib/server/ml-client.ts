/**
 * ML backend HTTP client.
 *
 * Base URL: process.env.ML_API_BASE_URL (defaults to Render deployment).
 *
 * Three patterns:
 *   startXxx()     — POST to create a prediction. Returns { id, status }. Fast (< 5 s).
 *   getXxxStatus() — GET /status/{id}. Instant snapshot (< 3 s). Use for polling.
 *   waitXxx()      — GET /wait/{id}. Server-side long-poll up to 5 min. DO NOT call
 *                     from Next.js server (Render drops idle connections at ~30 s).
 *                     Only safe when the browser calls Render directly.
 */

const ML_BASE = process.env.ML_API_BASE_URL ?? "https://vizzle-backend-vvc6.onrender.com";

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;
const RETRYABLE_STATUS = new Set([502, 503, 504]);

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

interface TransformResult {
  id?: string;
  status: string;
  output?: string | string[] | null;
  error?: string | null;
  model_used?: string | null;
}

async function mlFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 30_000,
  attempt = 0,
): Promise<T> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const res = await fetch(`${ML_BASE}${path}`, {
      ...init,
      signal: ac.signal,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });

    if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_RETRIES) {
      clearTimeout(timer);
      await sleep(RETRY_DELAY * (attempt + 1));
      return mlFetch<T>(path, init, timeoutMs, attempt + 1);
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ML ${res.status}: ${body}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    // Retry on network errors (fetch failed / ECONNRESET)
    if (attempt < MAX_RETRIES && err instanceof TypeError) {
      clearTimeout(timer);
      await sleep(RETRY_DELAY * (attempt + 1));
      return mlFetch<T>(path, init, timeoutMs, attempt + 1);
    }
    // Retry AbortError (timeout) once — Render cold start can take 30-60s
    if (attempt < MAX_RETRIES && err instanceof Error && err.name === "AbortError") {
      clearTimeout(timer);
      console.log(`[ml-client] timeout on ${path}, retrying (attempt ${attempt + 1})…`);
      await sleep(RETRY_DELAY);
      return mlFetch<T>(path, init, timeoutMs, attempt + 1);
    }
    // Wrap AbortError in a readable message
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`ML backend timed out after ${Math.round(timeoutMs / 1000)}s — Render may be cold-starting. Try again.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ── Virtual try-on ────────────────────────────────────────────────────────────

export function startVirtualTryOn(payload: Record<string, unknown>) {
  // 90s — Render cold start can take 30-60s before FastAPI even boots
  return mlFetch<{ id: string; status: string }>(
    "/api/virtual-try-on/",
    { method: "POST", body: JSON.stringify(payload) },
    90_000,
  );
}

export function getTryonStatus(predictionId: string) {
  // 30s — /status/ is instant when Render is warm, but allow for cold start
  return mlFetch<TransformResult>(
    `/api/virtual-try-on/status/${predictionId}`,
    { method: "GET" },
    30_000,
  );
}

// ── Layered try-on ────────────────────────────────────────────────────────────

export function startLayeredTryOn(payload: Record<string, unknown>) {
  return mlFetch<{ id: string; status: string }>(
    "/api/layered-try-on/",
    { method: "POST", body: JSON.stringify(payload) },
    90_000,
  );
}

export function getLayeredStatus(predictionId: string) {
  return mlFetch<TransformResult>(
    `/api/layered-try-on/status/${predictionId}`,
    { method: "GET" },
    30_000,
  );
}

// ── Video generation ──────────────────────────────────────────────────────────

export function startGenerateVideo(payload: Record<string, unknown>) {
  return mlFetch<{ id: string; status: string }>(
    "/api/generate-video/",
    { method: "POST", body: JSON.stringify(payload) },
    90_000,
  );
}

export function getVideoStatus(predictionId: string) {
  return mlFetch<TransformResult>(
    `/api/generate-video/status/${predictionId}`,
    { method: "GET" },
    30_000,
  );
}

// ── Legacy /wait/ wrappers — only used by executeImageTryOn (dead code) ───────
// Kept temporarily to avoid compile errors. These hit Render's 30 s proxy limit.

export function waitVirtualTryOn(predictionId: string, timeoutMs = 330_000) {
  return mlFetch<TransformResult>(`/api/virtual-try-on/wait/${predictionId}`, { method: "GET" }, timeoutMs);
}
export function waitLayeredTryOn(predictionId: string, timeoutMs = 360_000) {
  return mlFetch<TransformResult>(`/api/layered-try-on/wait/${predictionId}`, { method: "GET" }, timeoutMs);
}
export function waitGenerateVideo(predictionId: string, timeoutMs = 660_000) {
  return mlFetch<TransformResult>(`/api/generate-video/wait/${predictionId}`, { method: "GET" }, timeoutMs);
}
