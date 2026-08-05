import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { listApiKeysForStore, setApiKeyActive } from "@/server/services/stores.service";

const patchSchema = z.object({
  key_id: z.string().min(1),
  is_active: z.boolean(),
});

export async function GET(
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
    const keys = await listApiKeysForStore(id);

    return NextResponse.json(
      {
        keys: keys.map((k) => ({
          id: k.id,
          key_prefix: k.keyPrefix,
          is_active: k.isActive,
          created_at: k.createdAt,
        })),
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

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
    const body = patchSchema.parse(await request.json());
    const key = await setApiKeyActive(id, body.key_id, body.is_active);

    return NextResponse.json(
      {
        message: `API key ${body.is_active ? "activated" : "revoked"}`,
        key: { id: key.id, key_prefix: key.keyPrefix, is_active: key.isActive },
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
