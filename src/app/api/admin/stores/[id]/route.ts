import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { adminUpdateStore, adminDeleteStore } from "@/server/services/stores.service";

const updateStoreSchema = z.object({
  store_name: z.string().min(1).max(100),
  domain: z.string().min(1).max(253),
});

export async function PATCH(
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
    const body = updateStoreSchema.parse(await request.json());
    const store = await adminUpdateStore({
      storeId: id,
      storeName: body.store_name,
      domain: body.domain,
    });

    return NextResponse.json(store, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
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
    await adminDeleteStore(id);

    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
