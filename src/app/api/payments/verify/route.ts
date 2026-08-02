/**
 * POST /api/payments/verify
 *
 * Verifies Razorpay payment signature and credits the store's wallet.
 * Must be called by the client immediately after Razorpay checkout succeeds.
 *
 * Body:  { razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *           store_id, package_index }
 * Returns: { success: true, new_balance: number }
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { handleApiError } from "@/server/http";
import {
  verifyRazorpaySignature,
  CREDIT_PACKAGES,
} from "@/server/services/razorpay.service";
import { addCredit } from "@/server/services/credits.service";
import { ApiError } from "@/server/errors";

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  store_id:            z.string().min(1),
  package_index:       z.number().int().min(0).max(4),
});

export async function POST(request: NextRequest) {
  try {
    await withJwt(request);

    const body = schema.parse(await request.json());

    // 1. Verify HMAC signature — throws 402 if invalid
    const valid = verifyRazorpaySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    if (!valid) {
      throw new ApiError(400, "Payment signature verification failed");
    }

    // 2. Determine credits to add
    const pkg = CREDIT_PACKAGES[body.package_index];
    if (!pkg) throw new ApiError(400, "Invalid package index");

    // 3. Credit the wallet
    const newBalance = await addCredit(
      body.store_id,
      pkg.creditsGiven,
      "PURCHASE",
      {
        description:       `Top-up ${pkg.label} → ₹${pkg.creditsGiven} credits`,
        razorpayOrderId:   body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
      }
    );

    return NextResponse.json({
      success:     true,
      new_balance: newBalance,
      credits_added: pkg.creditsGiven,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
