import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { createStore, listStores } from "@/server/services/stores.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const createStoreSchema = z.object({
  store_name: z.string().min(1).max(100),
  domain: z.string().min(1).max(253),
});

export async function GET(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const stores = await listStores(user.id);
    return NextResponse.json(
      { stores },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const body = createStoreSchema.parse(await request.json());
    const response = await createStore({
      userId: user.id,
      storeName: body.store_name,
      domain: body.domain,
    });
    return NextResponse.json(response, {
      status: 201,
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
