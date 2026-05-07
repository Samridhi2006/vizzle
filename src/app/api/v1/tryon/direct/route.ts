import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { executeDirectTryOn } from "@/server/services/tryon.service";

const schema = z.object({
  user_photo_url: z.string().url(),
  product_image_url: z.string().url(),
  garment_type: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`tryon:${store.id}`);

    const payload = schema.parse(await request.json());
    const userIdentifier = request.headers.get("x-vizzle-user") ?? undefined;

    const response = await executeDirectTryOn({
      storeId: store.id,
      userPhotoUrl: payload.user_photo_url,
      productImageUrl: payload.product_image_url,
      garmentType: payload.garment_type,
      params: payload.params,
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

