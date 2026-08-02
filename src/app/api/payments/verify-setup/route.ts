import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { handleApiError } from "@/server/http";
import { verifyRazorpaySignature } from "@/server/services/razorpay.service";
import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";

const SETUP_LIMITS: Record<string, { requestsPerHour: number; requestsPerDay: number }> = {
  BASIC:   { requestsPerHour: 100,  requestsPerDay: 1000  },
  GOLD:    { requestsPerHour: 300,  requestsPerDay: 3000  },
  PREMIUM: { requestsPerHour: 1500, requestsPerDay: 15000 },
};

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  store_id:            z.string().min(1),
  tier:                z.enum(["BASIC", "GOLD", "PREMIUM"]),
});

export async function POST(request: NextRequest) {
  try {
    await withJwt(request);

    const body = schema.parse(await request.json());

    // 1. Verify HMAC signature
    const valid = verifyRazorpaySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    if (!valid) {
      throw new ApiError(400, "Payment signature verification failed");
    }

    const limits = SETUP_LIMITS[body.tier];

    // 2. Activate StoreTier
    const updatedTier = await prisma.storeTier.upsert({
      where: { storeId: body.store_id },
      create: {
        storeId: body.store_id,
        tier: body.tier,
        requestsPerHour: limits.requestsPerHour,
        requestsPerDay: limits.requestsPerDay,
        activatedAt: new Date(),
      },
      update: {
        tier: body.tier,
        requestsPerHour: limits.requestsPerHour,
        requestsPerDay: limits.requestsPerDay,
        activatedAt: new Date(),
      },
    });

    // 3. Record transaction log for record
    await prisma.creditTransaction.create({
      data: {
        storeId: body.store_id,
        type: "PURCHASE",
        amount: 0, // Setup fee is separate from credit wallet
        description: `Activated One-Time Setup Plan: ${body.tier}`,
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      tier: updatedTier.tier,
      requests_per_hour: updatedTier.requestsPerHour,
      requests_per_day: updatedTier.requestsPerDay,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
