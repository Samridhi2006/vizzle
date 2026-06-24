import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withJwt } from "@/server/middleware/withJwt";
import {
  deleteProductById,
  updateProductById,
} from "@/server/services/products.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const updateProductJsonSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  cost: z.coerce.number().nonnegative(),
  image_url: z.string().url().optional(),
  category: z.string().optional(),
  size_chart_url: z.string().url().optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);
    const { id } = await params;
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("image");
      const name = String(form.get("name") ?? "");
      const brand = String(form.get("brand") ?? "");
      const cost = Number(form.get("cost") ?? 0);
      const category = String(form.get("category") ?? "");
      const sizeChartUrl = String(form.get("size_chart_url") ?? "");

      let imageFileBuffer: Buffer | undefined;
      if (file && file instanceof Blob) {
        imageFileBuffer = Buffer.from(await file.arrayBuffer());
      }

      const response = await updateProductById({
        userId: user.id,
        vizzleProductId: id,
        name,
        brand,
        cost,
        category: category || undefined,
        sizeChartUrl: sizeChartUrl || undefined,
        imageFileBuffer,
      });

      return NextResponse.json(response, {
        status: 200,
        headers: corsHeaders(origin),
      });
    }

    const body = updateProductJsonSchema.parse(await request.json());
    const response = await updateProductById({
      userId: user.id,
      vizzleProductId: id,
      name: body.name,
      brand: body.brand,
      cost: body.cost,
      category: body.category,
      sizeChartUrl: body.size_chart_url,
      customFields: body.custom_fields as any,
      imageUrl: body.image_url,
    });

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders(origin),
    });
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
    const { id } = await params;
    await deleteProductById(user.id, id);
    return new NextResponse(null, {
      status: 204,
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
