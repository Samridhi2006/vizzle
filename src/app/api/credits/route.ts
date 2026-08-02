/**
 * GET /api/credits?store_id=xxx
 *
 * Returns current credit balance + recent transaction history for a store.
 * Requires dashboard JWT auth.
 *
 * Response: { balance: number, transactions: CreditTransaction[] }
 */
import { NextRequest, NextResponse } from "next/server";
import { withJwt } from "@/server/middleware/withJwt";
import { handleApiError } from "@/server/http";
import { getBalance, getTransactions, getStoreTier } from "@/server/services/credits.service";

export async function GET(request: NextRequest) {
  try {
    await withJwt(request);

    const storeId = request.nextUrl.searchParams.get("store_id");
    if (!storeId) {
      return NextResponse.json({ error: "store_id is required" }, { status: 400 });
    }

    const [balance, transactions, tier] = await Promise.all([
      getBalance(storeId),
      getTransactions(storeId, 50),
      getStoreTier(storeId),
    ]);

    return NextResponse.json({
      balance,
      transactions,
      tier: tier ?? {
        tier: "BASIC",
        requestsPerHour: 100,
        requestsPerDay: 1000,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
