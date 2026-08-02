/**
 * POST /api/v1/generate-video
 *
 * Proxy to the Python ML engine — generates an animated MP4 from a
 * try-on result image.  Returns prediction_id immediately (async).
 * Client polls GET /api/v1/generate-video/status/{id}.
 *
 * Request:  { image_url, motion_type?, duration?, fps? }
 * Response: { prediction_id, status }   (HTTP 202)
 *
 * Credits: ₹5.00 deducted per request.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { startGenerateVideo } from "@/lib/server/ml-client";
import {
  deductCredit,
  addCredit,
  COST_VIDEO,
} from "@/server/services/credits.service";

const schema = z.object({
  image_url:   z.string().url(),
  motion_type: z.enum(["subtle_walk", "pose_showcase", "gentle_turn"]).optional(),
  duration:    z.number().min(2).max(10).optional(),
  fps:         z.literal(24).optional(),  // Seedance-1-Pro only supports fps=24
});

export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    await withRateLimit(`video:${store.id}`, store.id);

    // Deduct ₹5.00 credit — refunded if ML fails to start
    await deductCredit(store.id, COST_VIDEO, "USAGE_VIDEO", "Video generation");

    const body = schema.parse(await request.json());

    let result;
    try {
      result = await startGenerateVideo({
        image_url:   body.image_url,
        motion_type: body.motion_type ?? "subtle_walk",
        duration:    body.duration    ?? 3,
        fps:         body.fps         ?? 24,
      });
    } catch (mlError) {
      // Refund if ML fails to start
      await addCredit(store.id, COST_VIDEO, "REFUND", {
        description: "Refund — video generation failed to start",
      }).catch(() => {});
      throw mlError;
    }

    return NextResponse.json(
      { prediction_id: result.id, status: result.status },
      { status: 202, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
