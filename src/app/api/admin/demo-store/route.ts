import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { createDemoStore } from "@/server/services/stores.service";

const schema = z.object({
  store_name: z.string().min(1, "Store name required"),
  domain: z.string().min(1, "Domain required"),
  tier: z.enum(["BASIC", "GOLD", "PREMIUM", "ENTERPRISE"]).default("BASIC"),
  requests_per_hour: z.number().int().min(1).default(100),
  requests_per_day: z.number().int().min(1).default(1000),
  initial_credits: z.number().min(0).default(500),
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

    const body = schema.parse(await request.json());

    const demoStore = await createDemoStore({
      userId: user.id,
      storeName: body.store_name,
      domain: body.domain,
      tier: body.tier,
      requestsPerHour: body.requests_per_hour,
      requestsPerDay: body.requests_per_day,
      initialCredits: body.initial_credits,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Demo store '${demoStore.store_name}' created successfully`,
        demo_store: demoStore,
      },
      { status: 201, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
