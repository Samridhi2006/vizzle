/**
 * POST /api/v1/tryon
 *
 * Starts a virtual try-on job and returns the prediction_id immediately.
 * The client polls GET /api/v1/tryon/status/{prediction_id} until done.
 *
 * Request:  { product_id: string, user_photo_url: string }
 * Response: { prediction_id: string, status: string }   (HTTP 202)
 *
 * Credits: ₹2.50 deducted per request. Returns 402 if balance insufficient.
 * Moderation: user_photo_url is checked for NSFW/inappropriate content first.
 *             Returns 422 if rejected — NO credit is deducted.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { startImageTryOn } from "@/server/services/tryon.service";
import { moderateImageUrl } from "@/lib/server/cloudinary";
import {
  deductCredit,
  addCredit,
  COST_IMAGE,
} from "@/server/services/credits.service";

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
    await withRateLimit(`tryon:${store.id}`, store.id);

    const body = schema.parse(await request.json());

    // ── AI Content Moderation ────────────────────────────────────────────────
    // Check the user photo BEFORE deducting any credits so a rejected image
    // never costs the merchant anything.
    const modStatus = await moderateImageUrl(body.user_photo_url);
    if (modStatus === "rejected") {
      return NextResponse.json(
        {
          error: "Image rejected by content moderation. " +
                 "Please upload an appropriate photo (no explicit or misleading content).",
          code:  "MODERATION_REJECTED",
        },
        { status: 422, headers: corsHeaders(origin) }
      );
    }
    // "pending" means Cloudinary is still checking — we allow it through
    // (the async moderation result is handled in the Cloudinary dashboard).

    // ── Deduct credits ────────────────────────────────────────────────────────
    // Deducted AFTER moderation so rejected images are always free.
    await deductCredit(store.id, COST_IMAGE, "USAGE_IMAGE", "Virtual try-on");

    let result;
    try {
      result = await startImageTryOn({
        storeId:      store.id,
        productId:    body.product_id,
        userPhotoUrl: body.user_photo_url,
        garmentType:  body.garment_type,
        useVision:    body.use_vision,
        params:       body.params,
      });
    } catch (mlError) {
      // Refund if ML fails to start
      await addCredit(store.id, COST_IMAGE, "REFUND", {
        description: "Refund — try-on failed to start",
      }).catch(() => {});
      throw mlError;
    }

    return NextResponse.json(result, { status: 202, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
