import { NextRequest, NextResponse } from "next/server";
import { withApiKey } from "@/server/middleware/withApiKey";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { getStatusByMode } from "@/server/services/tryon.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    const { id } = await context.params;

    const mode = request.nextUrl.searchParams.get("mode") ?? "tryon";
    const resolvedMode =
      mode === "layered" || mode === "video" ? mode : "tryon";
    const response = await getStatusByMode(resolvedMode, id);
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
