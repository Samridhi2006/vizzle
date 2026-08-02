import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";

type Bucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, Bucket>();

const FALLBACK_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? "3600000"); // 1 hour
const FALLBACK_LIMIT     = Number(process.env.RATE_LIMIT_MAX        ?? "100");

/**
 * Enforce rate limiting per store, using the store's StoreTier if available.
 * Falls back to env-var defaults (100 req/hr) if no tier is set.
 *
 * @param key      Unique key for the bucket, e.g. "tryon:{storeId}"
 * @param storeId  Store ID — used to look up tier-based limit
 */
export async function withRateLimit(key: string, storeId?: string): Promise<void> {
  // Resolve limit from StoreTier if storeId given
  let limit = FALLBACK_LIMIT;
  if (storeId) {
    const tier = await prisma.storeTier.findUnique({ where: { storeId } });
    if (!tier || tier.tier === "UNPAID" || tier.requestsPerHour === 0) {
      throw new ApiError(
        402,
        "One-time store setup plan required. Please select and pay for a setup plan (Basic ₹2,000, Gold ₹5,000, Premium ₹15,000) under Billing in your Vizzle Dashboard to activate API access."
      );
    }
    limit = tier.requestsPerHour;
  }

  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, {
      count:   1,
      resetAt: now + FALLBACK_WINDOW_MS,
    });
    return;
  }

  if (current.count >= limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    throw new ApiError(429, "Rate limit exceeded", { retryAfter });
  }

  current.count += 1;
  rateBuckets.set(key, current);
}
