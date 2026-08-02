import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { handleApiError } from "@/server/http";
import { createRazorpayOrder } from "@/server/services/razorpay.service";

const SETUP_PRICES: Record<string, { tier: string; amountPaid: number; requestsPerHour: number; requestsPerDay: number }> = {
  BASIC:   { tier: "BASIC",   amountPaid: 2000,  requestsPerHour: 100,  requestsPerDay: 1000  },
  GOLD:    { tier: "GOLD",    amountPaid: 5000,  requestsPerHour: 300,  requestsPerDay: 3000  },
  PREMIUM: { tier: "PREMIUM", amountPaid: 15000, requestsPerHour: 1500, requestsPerDay: 15000 },
};

const schema = z.object({
  tier: z.enum(["BASIC", "GOLD", "PREMIUM"]),
  store_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await withJwt(request);

    const body = schema.parse(await request.json());
    const pkg = SETUP_PRICES[body.tier];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid setup tier" }, { status: 400 });
    }

    const amountInPaise = pkg.amountPaid * 100;
    const shortId = body.store_id.slice(-8);
    const receipt = `stp_${shortId}_${Math.floor(Date.now() / 1000)}`;

    const order = await createRazorpayOrder(amountInPaise, receipt);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      tier: pkg.tier,
      amount_paid: pkg.amountPaid,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
