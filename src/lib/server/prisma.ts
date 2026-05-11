import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Wrap any Prisma call with automatic reconnect on NeonDB's
 * "terminating connection due to administrator command" (E57P01).
 * Usage: await withRetry(() => prisma.user.findUnique(...))
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTerminated =
        msg.includes("E57P01") ||
        msg.includes("terminating connection") ||
        msg.includes("connection closed") ||
        msg.includes("Connection pool timeout") ||
        msg.includes("Can't reach database server");
      if (!isTerminated || i === retries - 1) throw err;
      // Brief pause before retry (Neon needs ~300 ms to wake)
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw last;
}
