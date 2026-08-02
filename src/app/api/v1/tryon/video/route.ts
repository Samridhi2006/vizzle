/**
 * POST /api/v1/tryon/video
 *
 * Video-based virtual try-on (user uploads a video instead of a photo).
 * Blocking — waits up to 6 min for result.
 *
 * Credits: ₹5.00 deducted per request (video costs more than image).
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { executeVideoTryOn } from "@/server/services/tryon.service";
import {
  deductCredit,
  addCredit,
  COST_VIDEO,
} from "@/server/services/credits.service";

const schema = z.object({
  product_id:     z.string().min(1),
  user_video_url: z.string().url(),
  garment_type:   z.string().optional(),
  params:         z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    await withRateLimit(`tryon:${store.id}`, store.id);

    // Deduct ₹5.00 credit before processing
    await deductCredit(store.id, COST_VIDEO, "USAGE_VIDEO", "Video try-on");

    const payload = schema.parse(await request.json());
    const userIdentifier = request.headers.get("x-vizzle-user") ?? undefined;

    let response;
    try {
      response = await executeVideoTryOn({
        storeId:      store.id,
        productId:    payload.product_id,
        userVideoUrl: payload.user_video_url,
        garmentType:  payload.garment_type,
        params:       payload.params,
        userIdentifier,
      });
    } catch (mlError) {
      await addCredit(store.id, COST_VIDEO, "REFUND", {
        description: "Refund — video try-on failed",
      }).catch(() => {});
      throw mlError;
    }

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
