import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { getPricingConfig, updatePricingConfig } from "@/server/services/pricing.service";

const updateSchema = z.object({
  credit_cost_image: z.number().positive().optional(),
  credit_cost_video: z.number().positive().optional(),
  setup_cost_basic: z.number().nonnegative().optional(),
  setup_cost_gold: z.number().nonnegative().optional(),
  setup_cost_premium: z.number().nonnegative().optional(),
  currency_symbol: z.string().min(1).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") ?? "*";
    const config = await getPricingConfig();
    return NextResponse.json({ pricing: config }, { headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

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

    const body = updateSchema.parse(await request.json());

    const updated = await updatePricingConfig({
      creditCostImage: body.credit_cost_image,
      creditCostVideo: body.credit_cost_video,
      setupCostBasic: body.setup_cost_basic,
      setupCostGold: body.setup_cost_gold,
      setupCostPremium: body.setup_cost_premium,
      currencySymbol: body.currency_symbol,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Dynamic pricing configuration updated successfully",
        pricing: updated,
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
