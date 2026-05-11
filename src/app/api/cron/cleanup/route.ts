import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { deleteCloudinaryImages } from "@/lib/server/cloudinary";

/**
 * GET /api/cron/cleanup
 *
 * Invoked once daily at 03:00 UTC by Vercel Cron (see vercel.json).
 * Deletes any remaining expired temp Cloudinary assets not already cleaned up
 * by the lazy cleanup that runs on each /api/v1/upload call.
 *
 * Protected by CRON_SECRET so it cannot be triggered by random callers.
 */
export async function GET(request: NextRequest) {
  // Verify Vercel's cron secret (set CRON_SECRET in env vars)
  const authHeader = request.headers.get("authorization");
  const secret     = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all expired, not-yet-deleted temp assets
    const expired = await prisma.tempAsset.findMany({
      where: {
        expiresAt: { lte: new Date() },
        deleted:   false,
      },
      select: { id: true, publicId: true },
      take: 200, // process at most 200 per run to stay within function timeout
    });

    if (expired.length === 0) {
      return NextResponse.json({ deleted: 0, message: "Nothing to clean up" });
    }

    const ids      = expired.map((a) => a.id);
    const publicIds = expired.map((a) => a.publicId);

    // Delete from Cloudinary (best-effort, won't throw)
    await deleteCloudinaryImages(publicIds);

    // Mark as deleted in DB
    await prisma.tempAsset.updateMany({
      where: { id: { in: ids } },
      data:  { deleted: true },
    });

    return NextResponse.json({
      deleted: expired.length,
      publicIds,
    });
  } catch (error) {
    console.error("[cron/cleanup] error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
