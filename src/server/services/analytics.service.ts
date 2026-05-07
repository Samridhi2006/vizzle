import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";

export async function getStoreAnalytics(input: {
  userId: string;
  storeId: string;
  from?: string;
  to?: string;
}) {
  const store = await prisma.store.findUnique({
    where: { id: input.storeId },
  });
  if (!store) throw new ApiError(404, "Store not found");
  if (store.userId !== input.userId) throw new ApiError(403, "Forbidden");

  const fromDate = input.from
    ? new Date(input.from)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDate = input.to ? new Date(input.to) : new Date();
  toDate.setHours(23, 59, 59, 999);

  const logs = await prisma.tryonLog.findMany({
    where: {
      storeId: input.storeId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      product: true,
    },
  });

  const tryons = logs.length;
  const users = new Set(logs.map((log) => log.userIdentifier).filter(Boolean)).size;
  const videoTryons = logs.filter((log) => log.mode === "video_id").length;
  const directModeCalls = logs.filter((log) => log.mode === "direct").length;
  const failed = logs.filter((log) => !log.success).length;
  const errorRate = tryons === 0 ? 0 : (failed / tryons) * 100;
  const latencyValues = logs
    .map((log) => log.latencyMs)
    .filter((n): n is number => typeof n === "number");
  const avgLatencyMs =
    latencyValues.length === 0
      ? 0
      : Math.round(
          latencyValues.reduce((sum, value) => sum + value, 0) /
            latencyValues.length
        );

  const byProductMap = new Map<
    string,
    { vizzle_product_id: string; product_id: string | null; name: string | null; tryon_count: number }
  >();
  for (const log of logs) {
    if (!log.vizzleProductId) continue;
    const key = log.vizzleProductId;
    const current = byProductMap.get(key);
    if (!current) {
      byProductMap.set(key, {
        vizzle_product_id: key,
        product_id: log.product?.productId ?? null,
        name: log.product?.name ?? null,
        tryon_count: 1,
      });
    } else {
      current.tryon_count += 1;
    }
  }

  const byProduct = [...byProductMap.values()].sort(
    (a, b) => b.tryon_count - a.tryon_count
  );

  return {
    store_id: input.storeId,
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    tryons,
    users,
    video_tryons: videoTryons,
    direct_mode_calls: directModeCalls,
    error_rate: Number(errorRate.toFixed(2)),
    avg_latency_ms: avgLatencyMs,
    by_product: byProduct,
  };
}
