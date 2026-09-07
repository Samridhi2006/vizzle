import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { corsHeaders, handleApiError } from "@/server/http";
import { uploadImageBuffer } from "@/lib/server/cloudinary";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * POST /api/v1/demo/upload
 *
 * Public, unauthenticated upload for the marketing site's live demo widget.
 * Body: multipart/form-data { photo: File }
 * Returns: { url }
 */
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") ?? "*";
    await withRateLimit(`demo-upload:${clientIp(request)}`);

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

    const { url } = await uploadImageBuffer(buffer, "vizzle/demo-temp");
    return NextResponse.json({ url }, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
