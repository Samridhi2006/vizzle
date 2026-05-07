import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";

const widgetCorsCache = new Map<string, { domain: string; expiresAt: number }>();
const WIDGET_CORS_TTL_MS = 60_000;

export function getDashboardAllowedOrigins(): string[] {
  // Default includes production domain + local dev.
  // Override via DASHBOARD_CORS_ORIGINS env var (comma-separated).
  const raw =
    process.env.DASHBOARD_CORS_ORIGINS ??
    "https://dashboard.vizzle.in,http://localhost:3001";
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
  if (!origin) throw new ApiError(403, "Missing Origin header");

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

  const normalized = store.domain.toLowerCase();
  if (hostname !== normalized) {
    throw new ApiError(403, "Origin not allowed for this store");
  }

  widgetCorsCache.set(cacheKey, {
    domain: normalized,
    expiresAt: Date.now() + WIDGET_CORS_TTL_MS,
  });

  return origin;
}
