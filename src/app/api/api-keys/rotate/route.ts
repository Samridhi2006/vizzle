import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { rotateStoreApiKey } from "@/server/services/stores.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const rotateSchema = z.object({
  store_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const body = rotateSchema.parse(await request.json());
    const response = await rotateStoreApiKey({
      userId: user.id,
      storeId: body.store_id,
    });
    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
