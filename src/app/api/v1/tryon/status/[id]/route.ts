/**
 * GET /api/v1/tryon/status/{id}
 *
 * Checks current status of a try-on prediction.
 * Calls ML backend /api/virtual-try-on/status/{id} — instant response (< 3 s).
 *
 * Response: { status, output_url, error, model_used }
 *   - status: "starting" | "processing" | "succeeded" | "failed" | "canceled"
 *   - output_url: image URL when status === "succeeded", null otherwise
 */
import { NextRequest, NextResponse } from "next/server";
import { withApiKey } from "@/server/middleware/withApiKey";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { checkImageTryOnStatus } from "@/server/services/tryon.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const store  = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    const { id } = await params;

    const result = await checkImageTryOnStatus(id, store.id);
    return NextResponse.json(result, { headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
