import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { suspendStore, resumeStore } from "@/server/services/stores.service";

const actionSchema = z.object({
  action: z.enum(["SUSPEND", "RESUME"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: admin access only" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const { id } = await params;
    const body = actionSchema.parse(await request.json());

    if (body.action === "SUSPEND") {
      await suspendStore(id);
    } else {
      await resumeStore(id);
    }

    return NextResponse.json(
      { message: body.action === "SUSPEND" ? "Store suspended" : "Store resumed" },
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
