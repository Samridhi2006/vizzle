import { NextRequest, NextResponse } from "next/server";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { uploadImageBuffer } from "@/lib/server/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/v1/products/upload-image
 *
 * Upload a garment image to Cloudinary and receive a permanent URL.
 * Use the returned image_url when registering a product via POST /api/v1/products.
 *
 * Auth:    x-api-key  (brand's vzk_ key)
 * Body:    multipart/form-data  { garment: File }
 * Returns: { image_url: string }
 *
 * Rate limit: 100 requests / 60 s per store (default; configurable via env).
 */
export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`products-upload:${store.id}`);

    const form = await request.formData();
    const file = form.get("garment");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing 'garment' field in form data" },
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
        { error: "Image exceeds 10 MB limit" },
        { status: 413, headers: corsHeaders(origin) }
      );
    }

    // Permanent product folder — never cleaned up by cron
    const { url } = await uploadImageBuffer(
      buffer,
      `vizzle/products/${store.id}`
    );

    return NextResponse.json(
      { image_url: url },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
