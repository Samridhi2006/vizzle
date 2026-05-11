/**
 * Lazy cleanup of expired Cloudinary temp assets.
 *
 * Called in the background from /api/v1/upload so that cleanup happens
 * on every try-on, not just when the daily cron fires.
 *
 * Uses waitUntil (edge) or fire-and-forget (node) — never blocks the response.
 */
import { prisma } from "@/lib/server/prisma";
import { deleteCloudinaryImages } from "@/lib/server/cloudinary";

export async function cleanupExpiredAssets(): Promise<void> {
  try {
    const expired = await prisma.tempAsset.findMany({
      where: { expiresAt: { lte: new Date() }, deleted: false },
      select: { id: true, publicId: true },
      take: 50, // small batch — this is inline, not a dedicated job
    });

    if (expired.length === 0) return;

    const ids       = expired.map((a) => a.id);
    const publicIds = expired.map((a) => a.publicId);

    await deleteCloudinaryImages(publicIds);
    await prisma.tempAsset.updateMany({
      where: { id: { in: ids } },
      data:  { deleted: true },
    });

    console.log(`[cleanup] deleted ${expired.length} expired temp assets`);
  } catch (err) {
    // Best-effort — never let cleanup failure break the upload response
    console.error("[cleanup] error:", err);
  }
}
