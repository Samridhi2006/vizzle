import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { ApiError } from "@/server/errors";
import { prisma } from "@/lib/server/prisma";
import { getTierDefinitions } from "@/server/services/tiers.service";

const updateTierSchema = z.object({
  store_id: z.string().min(1),
  tier: z.string().min(1),
  // Optional custom overrides — when omitted, the tier's own preset limits are used.
  requests_per_hour: z.number().int().min(0).optional(),
  requests_per_day: z.number().int().min(0).optional(),
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
    const definitions = await getTierDefinitions();
    const preset = definitions[body.tier];

    if (!preset) {
      throw new ApiError(
        400,
        `Unknown tier "${body.tier}". Valid tiers: ${Object.keys(definitions).join(", ")}`
      );
    }

    const requestsPerHour = body.requests_per_hour ?? preset.requestsPerHour;
    const requestsPerDay = body.requests_per_day ?? preset.requestsPerDay;

    const storeTier = await prisma.storeTier.upsert({
      where: { storeId: body.store_id },
      create: {
        storeId: body.store_id,
        tier: body.tier,
        requestsPerHour,
        requestsPerDay,
      },
      update: {
        tier: body.tier,
        requestsPerHour,
        requestsPerDay,
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
