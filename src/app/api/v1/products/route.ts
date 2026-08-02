import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiKey } from "@/server/middleware/withApiKey";
import { withRateLimit } from "@/server/middleware/withRateLimit";
import { assertWidgetCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { createOrUpdateProduct } from "@/server/services/products.service";

const schema = z.object({
  product_id:     z.string().min(1),
  name:           z.string().min(1),
  brand:          z.string().min(1),
  cost:           z.coerce.number().nonnegative(),
  image_url:      z.string().url(),
  category:       z.string().optional(),
  size_chart_url: z.string().url().optional(),
  custom_fields:  z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /api/v1/products
 *
 * Register or update a product in your catalog (upsert by product_id).
 * Calling with the same product_id updates the existing product.
 * store_id is inferred from the API key — never pass it in the body.
 *
 * Auth:       x-api-key  (brand's vzk_ key)
 * Body:       application/json
 * Mandatory:  product_id, name, brand, cost, image_url
 * Optional:   category, size_chart_url, custom_fields
 * Returns:    { vizzle_product_id, product_id, image_url }
 *
 * Rate limit: 100 requests / 60 s per store (default; configurable via env).
 */
export async function POST(request: NextRequest) {
  try {
    const store = await withApiKey(request);
    const origin = await assertWidgetCors(request, store.id);
    withRateLimit(`products-upsert:${store.id}`);

    const body = schema.parse(await request.json());

    const result = await createOrUpdateProduct({
      userId:       store.userId,
      storeId:      store.id,
      productId:    body.product_id,
      name:         body.name,
      brand:        body.brand,
      cost:         body.cost,
      imageUrl:     body.image_url,
      category:     body.category,
      sizeChartUrl: body.size_chart_url,
      customFields: body.custom_fields as any,
    });

    return NextResponse.json(
      {
        vizzle_product_id: result.vizzle_product_id,
        product_id:        body.product_id,
        image_url:         result.image_url,
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
