import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { bulkImportProducts } from "@/server/services/products.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const bulkSchema = z.object({
  store_id: z.string().min(1),
  products: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        brand: z.string().optional(),
        cost: z.coerce.number().nonnegative(),
        image_url: z.string().url(),
        category: z.string().optional(),
        size_chart_url: z.string().url().optional(),
        custom_fields: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const body = bulkSchema.parse(await request.json());
    const response = await bulkImportProducts({
      userId: user.id,
      storeId: body.store_id,
      products: body.products as any,
    });
    return NextResponse.json(response, {
      status: 207,
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

