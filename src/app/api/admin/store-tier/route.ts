import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { prisma } from "@/lib/server/prisma";

const TIER_CONFIGS: Record<string, { requestsPerHour: number; requestsPerDay: number }> = {
  BASIC:      { requestsPerHour: 100,  requestsPerDay: 1000 },
  GOLD:       { requestsPerHour: 300,  requestsPerDay: 3000 },
  PREMIUM:    { requestsPerHour: 1500, requestsPerDay: 15000 },
  ENTERPRISE: { requestsPerHour: 10000, requestsPerDay: 100000 },
};

const updateTierSchema = z.object({
  store_id: z.string().min(1),
  tier: z.enum(["BASIC", "GOLD", "PREMIUM", "ENTERPRISE"]),
});

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: admin access only" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const body = updateTierSchema.parse(await request.json());
    const config = TIER_CONFIGS[body.tier];

    const storeTier = await prisma.storeTier.upsert({
      where: { storeId: body.store_id },
      create: {
        storeId: body.store_id,
        tier: body.tier,
        requestsPerHour: config.requestsPerHour,
        requestsPerDay: config.requestsPerDay,
      },
      update: {
        tier: body.tier,
        requestsPerHour: config.requestsPerHour,
        requestsPerDay: config.requestsPerDay,
      },
    });

    return NextResponse.json(
      {
        message: `Store tier updated to ${body.tier}`,
        store_tier: {
          store_id: storeTier.storeId,
          tier: storeTier.tier,
          requests_per_hour: storeTier.requestsPerHour,
          requests_per_day: storeTier.requestsPerDay,
        },
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
