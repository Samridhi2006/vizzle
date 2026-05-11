import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";

const widgetCorsCache = new Map<string, { domain: string; expiresAt: number }>();
const WIDGET_CORS_TTL_MS = 60_000;

/**
 * Normalise whatever the brand typed into the domain field so we always
 * compare bare hostnames:
 *   "https://shop.acme.com"  →  "shop.acme.com"
 *   "shop.acme.com:3000"     →  "shop.acme.com"
 *   "shop.acme.com/path"     →  "shop.acme.com"
 *   "localhost"              →  "localhost"
 */
function normalizeStoreDomain(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "";
  try {
    if (s.includes("://")) return new URL(s).hostname.toLowerCase();
  } catch {
    // fall through
  }
  return (s.split("/")[0] ?? s).split(":")[0]?.trim() ?? s;
}

/**
 * Returns true if the request origin hostname matches the stored domain.
 *
 * Rules:
 *  • Exact match after normalisation (covers 99% of production cases)
 *  • localhost ↔ 127.0.0.1 (convenience for local dev)
 *  • Stored domain "*.acme.com" matches any subdomain of acme.com
 */
function originMatchesDomain(hostname: string, storedDomain: string): boolean {
  const normalized = normalizeStoreDomain(storedDomain);

  if (hostname === normalized) return true;

  // localhost / loopback equivalence (dev only)
  if (
    (normalized === "localhost" || normalized === "127.0.0.1") &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  ) {
    return true;
  }

  // Wildcard subdomain: stored domain "*.acme.com"
  if (normalized.startsWith("*.")) {
    const base = normalized.slice(2); // "acme.com"
    if (hostname === base || hostname.endsWith(`.${base}`)) return true;
  }

  return false;
}

export function getDashboardAllowedOrigins(): string[] {
  const raw =
    process.env.DASHBOARD_CORS_ORIGINS ??
    "https://dashboard.vizzle.in,http://localhost:3000";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function assertDashboardCors(request: NextRequest): string {
  const origin = request.headers.get("origin") ?? "";
  const allowed = getDashboardAllowedOrigins();
  if (!origin) return allowed[0] ?? "*";
  if (!allowed.includes(origin)) {
    throw new ApiError(403, "Origin not allowed");
  }
  return origin;
}

export async function assertWidgetCors(
  request: NextRequest,
  storeId: string
): Promise<string> {
  const origin = request.headers.get("origin");

  // No Origin header = server-to-server call (cURL, Postman, server-side fetch).
  // These are fine — they don't need CORS, just the API key.
  if (!origin) {
    const store = await prisma.store.findUnique({ where: { id: storeId }, select: { domain: true } });
    return store?.domain ?? "*";
  }

  let hostname: string;
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    throw new ApiError(403, "Invalid Origin header");
  }

  const cacheKey = `${storeId}:${hostname}`;
  const cached = widgetCorsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return origin;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { domain: true },
  });
  if (!store) throw new ApiError(403, "Store not found");

  // Local widget QA: relax domain check on loopback (API key still authenticates the store).
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    widgetCorsCache.set(cacheKey, {
      domain: normalizeStoreDomain(store.domain),
      expiresAt: Date.now() + WIDGET_CORS_TTL_MS,
    });
    return origin;
  }

  if (!originMatchesDomain(hostname, store.domain)) {
    throw new ApiError(
      403,
      `Origin "${hostname}" not allowed. Add "${hostname}" as the store domain in Dashboard → Stores.`
    );
  }

  widgetCorsCache.set(cacheKey, {
    domain: normalizeStoreDomain(store.domain),
    expiresAt: Date.now() + WIDGET_CORS_TTL_MS,
  });

  return origin;
}
