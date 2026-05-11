import { NextRequest, NextResponse } from "next/server";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { uploadImageBuffer } from "@/lib/server/cloudinary";
import { prisma } from "@/lib/server/prisma";
import { cleanupExpiredAssets } from "@/lib/server/cleanup";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES      = 10 * 1024 * 1024; // 10 MB
const TTL_MS         = 60 * 60 * 1000;   // 1 hour

/**
 * POST /api/v1/upload
 *
 * Widget step 1: shopper picks a photo → brand's script sends it here.
 * We upload to our Cloudinary temp folder and return a public URL.
 * The URL is then passed to POST /api/v1/tryon.
 * Temp assets are auto-deleted after 1 hour by /api/cron/cleanup.
 *
 * Auth:    x-api-key  (brand's vzk_ key)
 * Body:    multipart/form-data  { photo: File }
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const store  = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`upload:${store.id}`);

    const form = await request.formData();
    const file = form.get("photo");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing 'photo' field in form data" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported type: ${file.type}. Use JPEG, PNG or WebP.` },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Photo exceeds 10 MB limit" },
        { status: 413, headers: corsHeaders(origin) }
      );
    }

    // Upload to a dedicated temp folder — never mixed with permanent product images
    const { url, publicId } = await uploadImageBuffer(
      buffer,
      `vizzle/tryon-temp/${store.id}`
    );

    // Track for automatic cleanup after 1 hour
    await prisma.tempAsset.create({
      data: {
        publicId,
        folder:    "tryon-temp",
        storeId:   store.id,
        expiresAt: new Date(Date.now() + TTL_MS),
      },
    }).catch(() => {}); // cleanup tracking is best-effort

    // Fire-and-forget: clean up expired assets in the background.
    // This supplements the daily Vercel cron (Hobby plan limit).
    cleanupExpiredAssets();

    return NextResponse.json({ url }, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
