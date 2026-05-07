import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import { createOrUpdateProduct, listProducts } from "@/server/services/products.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const createProductJsonSchema = z.object({
  store_id: z.string().min(1),
  product_id: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  cost: z.coerce.number().nonnegative(),
  image_url: z.string().url().optional(),
  category: z.string().optional(),
  size_chart_url: z.string().url().optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const storeId = request.nextUrl.searchParams.get("store_id");
    if (!storeId) {
      return NextResponse.json(
        { error: "store_id query param is required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }
    const products = await listProducts(user.id, storeId);
    return NextResponse.json(
      { products },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("image");
      const storeId = String(form.get("store_id") ?? "");
      const productId = String(form.get("product_id") ?? "");
      const name = String(form.get("name") ?? "");
      const brand = String(form.get("brand") ?? "");
      const cost = Number(form.get("cost") ?? 0);
      const category = String(form.get("category") ?? "");
      const sizeChartUrl = String(form.get("size_chart_url") ?? "");

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: "image file is required" },
          { status: 400, headers: corsHeaders(origin) }
        );
      }
      const imageFileBuffer = Buffer.from(await file.arrayBuffer());

      const response = await createOrUpdateProduct({
        userId: user.id,
        storeId,
        productId,
        name,
        brand,
        cost,
        category: category || undefined,
        sizeChartUrl: sizeChartUrl || undefined,
        imageFileBuffer,
      });

      return NextResponse.json(response, {
        status: 201,
        headers: corsHeaders(origin),
      });
    }

    const body = createProductJsonSchema.parse(await request.json());
    const response = await createOrUpdateProduct({
      userId: user.id,
      storeId: body.store_id,
      productId: body.product_id,
      name: body.name,
      brand: body.brand,
      cost: body.cost,
      category: body.category,
      sizeChartUrl: body.size_chart_url,
      customFields: body.custom_fields as any,
      imageUrl: body.image_url,
    });

    return NextResponse.json(response, {
      status: 201,
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

