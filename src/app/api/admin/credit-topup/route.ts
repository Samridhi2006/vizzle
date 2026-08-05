import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { addCredit, deductCredit, getBalance } from "@/server/services/credits.service";

const topupSchema = z.object({
  store_id: z.string().min(1),
  amount: z.number().positive(),
  direction: z.enum(["ADD", "DEDUCT"]).default("ADD"),
  description: z.string().optional(),
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

    const body = topupSchema.parse(await request.json());
    const description = body.description ?? `Manual admin ${body.direction === "ADD" ? "top-up" : "deduction"} by ${user.email}`;

    let balance: number;
    if (body.direction === "ADD") {
      balance = await addCredit(body.store_id, body.amount, "PURCHASE", { description });
    } else {
      await deductCredit(body.store_id, body.amount, "PURCHASE", description);
      balance = await getBalance(body.store_id);
    }

    return NextResponse.json(
      {
        message: `Store balance updated`,
        store_id: body.store_id,
        balance,
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
