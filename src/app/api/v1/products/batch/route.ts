import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { bulkImportProducts } from "@/server/services/products.service";

const schema = z.object({
  products: z
    .array(
      z.object({
        product_id:     z.string().min(1),
        name:           z.string().min(1),
        brand:          z.string().optional(),
        cost:           z.coerce.number().nonnegative(),
        image_url:      z.string().url(),
        category:       z.string().optional(),
        size_chart_url: z.string().url().optional(),
        custom_fields:  z.record(z.string(), z.unknown()).optional(),
      })
    )
    .min(1)
    .max(1000),
});

/**
 * POST /api/v1/products/batch
 *
 * Register or update up to 1 000 products in one request (upsert by product_id).
 * Each item with the same product_id updates the existing product.
 * store_id is inferred from the API key — never pass it in the body.
 *
 * Auth:       x-api-key  (brand's vzk_ key)
 * Body:       application/json  { products: [...] }
 * Mandatory per item: product_id, name, cost, image_url
 * Optional per item:  brand, category, size_chart_url, custom_fields
 * Returns:    { imported: number, errors: Array<{ id, error }> }  HTTP 207
 *
 * Rate limit: 100 requests / 60 s per store (default; configurable via env).
 */
export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`products-batch:${store.id}`);

    const body = schema.parse(await request.json());

    const result = await bulkImportProducts({
      userId:   store.userId,
      storeId:  store.id,
      products: body.products.map((p) => ({
        id:             p.product_id,
        name:           p.name,
        brand:          p.brand,
        cost:           p.cost,
        image_url:      p.image_url,
        category:       p.category,
        size_chart_url: p.size_chart_url,
        custom_fields:  p.custom_fields as any,
      })),
    });

    return NextResponse.json(result, { status: 207, headers: corsHeaders(origin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
