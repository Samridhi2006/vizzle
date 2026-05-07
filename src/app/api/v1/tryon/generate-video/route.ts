import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { executeGenerateVideo } from "@/server/services/tryon.service";

const schema = z.object({
  image_url: z.string().url(),
  motion_type: z.string().optional(),
  duration: z.coerce.number().int().min(2).max(10).optional(),
  fps: z.coerce.number().int().min(12).max(30).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`tryon:${store.id}`);

    const payload = schema.parse(await request.json());
    const userIdentifier = request.headers.get("x-vizzle-user") ?? undefined;

    const response = await executeGenerateVideo({
      storeId: store.id,
      imageUrl: payload.image_url,
      motionType: payload.motion_type,
      duration: payload.duration,
      fps: payload.fps,
      userIdentifier,
    });

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
