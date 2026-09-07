import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { corsHeaders, handleApiError } from "@/server/http";
import { moderateImageUrl } from "@/lib/server/cloudinary";
import { generateCompositeTryOn } from "@/server/services/compositeTryon.service";

// sharp / onnxruntime need the Node runtime, not the Edge runtime.
export const runtime = "nodejs";

/**
 * POST /api/v1/demo/composite-tryon
 *
 * Public, unauthenticated try-on endpoint for the marketing site's live demo
 * widget (LandingPage). Unlike /api/v1/tryon it does not require a store API
 * key or deduct credits — it's rate-limited per IP instead. Uses the native
 * cutout+composite engine (no external ML call).
 *
 * Body:    { human_img: string (url), garm_img: string (url), garment_type?: string }
 * Returns: { output_url, model_used, status }
 */
const schema = z.object({
  human_img: z.string().url(),
  garm_img: z.string().url(),
  garment_type: z.string().optional(),
});

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") ?? "*";
    await withRateLimit(`demo-composite-tryon:${clientIp(request)}`);

    const body = schema.parse(await request.json());

    // Public, unauthenticated endpoint — moderate both the uploaded person
    // photo and the garment image before spending any compute on them.
    const [personMod, garmentMod] = await Promise.all([
      moderateImageUrl(body.human_img),
      moderateImageUrl(body.garm_img),
    ]);
    if (personMod === "rejected" || garmentMod === "rejected") {
      return NextResponse.json(
        { error: "Image rejected by content moderation.", code: "MODERATION_REJECTED" },
        { status: 422, headers: corsHeaders(origin) }
      );
    }

    const result = await generateCompositeTryOn({
      humanImgUrl: body.human_img,
      garmentImgUrl: body.garm_img,
      garmentType: body.garment_type,
    });

    return NextResponse.json(result, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
