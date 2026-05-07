import { NextRequest, NextResponse } from "next/server";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { uploadImageBuffer } from "@/lib/server/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/v1/upload
 *
 * Called by the brand's widget when a shopper selects their photo.
 * Uploads the photo to Cloudinary and returns a public URL so the
 * widget can immediately pass it to POST /api/v1/tryon.
 *
 * Auth   : x-api-key header (brand's vzk_ key)
 * Body   : multipart/form-data  { photo: File }
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
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
        { error: `Unsupported file type: ${file.type}. Use JPEG, PNG or WebP.` },
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

    // Store under a per-store folder so each brand's usage is isolated
    const url = await uploadImageBuffer(buffer, `vizzle/user-photos/${store.id}`);

    return NextResponse.json({ url }, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
