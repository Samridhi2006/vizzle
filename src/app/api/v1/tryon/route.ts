/**
 * POST /api/v1/tryon
 *
 * Starts a virtual try-on job and returns the prediction_id immediately.
 * The client polls GET /api/v1/tryon/status/{prediction_id} until done.
 *
 * Request:  { product_id: string, user_photo_url: string }
 * Response: { prediction_id: string, status: string }   (HTTP 202)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { startImageTryOn } from "@/server/services/tryon.service";

const schema = z.object({
  product_id:     z.string().min(1),
  user_photo_url: z.string().url(),
  garment_type:   z.string().optional(),
  use_vision:     z.boolean().optional(),
  params:         z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const store  = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`tryon:${store.id}`);

    const body = schema.parse(await request.json());

    const result = await startImageTryOn({
      storeId:      store.id,
      productId:    body.product_id,
      userPhotoUrl: body.user_photo_url,
      garmentType:  body.garment_type,
      useVision:    body.use_vision,
      params:       body.params,
    });

    return NextResponse.json(result, { status: 202, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
