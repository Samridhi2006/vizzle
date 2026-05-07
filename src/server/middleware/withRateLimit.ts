import { ApiError } from "@/server/errors";

type Bucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, Bucket>();

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? "60000");
const LIMIT = Number(process.env.RATE_LIMIT_MAX ?? "100");

export function withRateLimit(key: string): void {
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return;
  }

  if (current.count >= LIMIT) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    throw new ApiError(429, "Rate limit exceeded", { retryAfter });
  }

  current.count += 1;
  rateBuckets.set(key, current);
}
