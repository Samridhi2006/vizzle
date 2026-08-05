import { NextRequest, NextResponse } from "next/server";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { getTransactions } from "@/server/services/credits.service";

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

    const storeId = request.nextUrl.searchParams.get("store_id");
    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required query param: store_id" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const transactions = await getTransactions(storeId, 100);

    return NextResponse.json(
      { store_id: storeId, transactions },
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
