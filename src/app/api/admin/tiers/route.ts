import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import {
  getTierDefinitions,
  upsertTierDefinition,
  deleteTierDefinition,
} from "@/server/services/tiers.service";

const tierSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(30)
    .regex(/^[A-Z0-9_]+$/, "Tier name must be uppercase letters, numbers, or underscores"),
  requests_per_hour: z.number().int().min(0),
  requests_per_day: z.number().int().min(0),
  price_label: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: admin access only" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const tiers = await getTierDefinitions();
    return NextResponse.json({ tiers }, { status: 200, headers: corsHeaders(origin) });
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

    const body = tierSchema.parse(await request.json());
    const tiers = await upsertTierDefinition({
      name: body.name,
      requestsPerHour: body.requests_per_hour,
      requestsPerDay: body.requests_per_day,
      priceLabel: body.price_label,
    });

    return NextResponse.json(
      { message: `Tier "${body.name}" saved`, tiers },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: admin access only" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const name = request.nextUrl.searchParams.get("name");
    if (!name) {
      return NextResponse.json(
        { error: "Missing required query param: name" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const tiers = await deleteTierDefinition(name);
    return NextResponse.json(
      { message: `Tier "${name}" removed`, tiers },
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
