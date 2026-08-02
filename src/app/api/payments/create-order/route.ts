/**
 * POST /api/payments/create-order
 *
 * Creates a Razorpay order for a credit top-up package.
 * Requires dashboard JWT auth (x-vizzle-jwt header or session).
 *
 * Body:  { packageIndex: number, store_id: string }
 * Returns: { order_id, amount, currency, key_id }
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { handleApiError } from "@/server/http";
import { createRazorpayOrder, CREDIT_PACKAGES } from "@/server/services/razorpay.service";

const schema = z.object({
  packageIndex: z.number().int().min(0).max(4),
  store_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await withJwt(request);

    const body = schema.parse(await request.json());
    const pkg = CREDIT_PACKAGES[body.packageIndex];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package index" }, { status: 400 });
    }

    const amountInPaise = pkg.amountPaid * 100; // INR → paise
    // Razorpay receipt must be ≤40 chars
    const shortId = body.store_id.slice(-8);
    const receipt = `vzl_${shortId}_${Math.floor(Date.now() / 1000)}`;


    const order = await createRazorpayOrder(amountInPaise, receipt);

    return NextResponse.json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   process.env.RAZORPAY_KEY_ID,
      // expose what the user will receive so the UI can show it
      credits_to_receive: pkg.creditsGiven,
      package: pkg,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
