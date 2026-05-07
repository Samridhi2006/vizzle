const ML_API_BASE_URL =
  process.env.ML_API_BASE_URL ?? "https://vizzle-backend-vvc6.onrender.com";
const ML_TIMEOUT_MS = Number(process.env.ML_TIMEOUT_MS ?? "60000");

// Retry these transient status codes (Render cold-start returns 502/503)
const RETRYABLE = new Set([502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function mlFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = ML_TIMEOUT_MS,
  attempt = 0
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${ML_API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    // Retry on transient server-side errors (cold start, gateway timeout)
    if (RETRYABLE.has(response.status) && attempt < MAX_RETRIES) {
      clearTimeout(timer);
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      return mlFetch<T>(path, init, timeoutMs, attempt + 1);
    }

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`ML API error ${response.status}: ${payload}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    // Retry on network-level failures (ECONNRESET, AbortError from timeout)
    if (attempt < MAX_RETRIES && err instanceof Error && err.name === "AbortError") {
      // Timeout — do NOT retry wait/status polls (they have their own long timeout)
      throw err;
    }
    if (attempt < MAX_RETRIES && err instanceof TypeError) {
      // Network error (fetch failed)
      clearTimeout(timer);
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      return mlFetch<T>(path, init, timeoutMs, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function startVirtualTryOn(payload: Record<string, unknown>) {
  return mlFetch<{ id: string; status: string }>("/api/virtual-try-on/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function waitVirtualTryOn(predictionId: string, timeoutMs = 360_000) {
  return mlFetch<{ status: string; output?: string | string[]; model_used?: string }>(
    `/api/virtual-try-on/wait/${predictionId}`,
    { method: "GET" },
    timeoutMs
  );
}

export function startLayeredTryOn(payload: Record<string, unknown>) {
  return mlFetch<{ id: string; status: string }>("/api/layered-try-on/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function waitLayeredTryOn(predictionId: string, timeoutMs = 360_000) {
  return mlFetch<{ status: string; output?: string | string[]; model_used?: string }>(
    `/api/layered-try-on/wait/${predictionId}`,
    { method: "GET" },
    timeoutMs
  );
}

export function startGenerateVideo(payload: Record<string, unknown>) {
  return mlFetch<{ id: string; status: string }>("/api/generate-video/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function waitGenerateVideo(predictionId: string, timeoutMs = 660_000) {
  return mlFetch<{ status: string; output?: string | string[]; model_used?: string }>(
    `/api/generate-video/wait/${predictionId}`,
    { method: "GET" },
    timeoutMs
  );
}

export function getTryonStatus(predictionId: string) {
  return mlFetch<Record<string, unknown>>(
    `/api/virtual-try-on/status/${predictionId}`,
    { method: "GET" }
  );
}

export function getLayeredStatus(predictionId: string) {
  return mlFetch<Record<string, unknown>>(
    `/api/layered-try-on/status/${predictionId}`,
    { method: "GET" }
  );
}

export function getVideoStatus(predictionId: string) {
  return mlFetch<Record<string, unknown>>(
    `/api/generate-video/status/${predictionId}`,
    { method: "GET" }
  );
}
