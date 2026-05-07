import { NextRequest, NextResponse } from "next/server";
import { withJwt } from "@/server/middleware/withJwt";
import { getStoreAnalytics } from "@/server/services/analytics.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

export async function GET(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    const storeId = request.nextUrl.searchParams.get("store_id");
    if (!storeId) {
      return NextResponse.json(
        { error: "store_id query param is required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const from = request.nextUrl.searchParams.get("from") ?? undefined;
    const to = request.nextUrl.searchParams.get("to") ?? undefined;

    const response = await getStoreAnalytics({
      userId: user.id,
      storeId,
      from,
      to,
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
