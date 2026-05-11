import { prisma } from "@/lib/server/prisma";
import { uploadImageBuffer } from "@/lib/server/cloudinary";
import { ApiError } from "@/server/errors";
import { Prisma } from "@prisma/client";

async function assertStoreOwnership(userId: string, storeId: string) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new ApiError(404, "Store not found");
  if (store.userId !== userId) throw new ApiError(403, "Forbidden");
  return store;
}

export async function listProducts(userId: string, storeId: string) {
  await assertStoreOwnership(userId, storeId);

  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    vizzle_product_id: product.id,
    product_id: product.productId,
    name: product.name,
    brand: product.brand,
    cost: product.cost,
    image_url: product.imageUrl,
    category: product.category,
    size_chart_url: product.sizeChartUrl,
    custom_fields: product.customFields,
    created_at: product.createdAt.toISOString(),
  }));
}

export async function createOrUpdateProduct(input: {
  userId: string;
  storeId: string;
  productId: string;
  name: string;
  brand: string;
  cost: number;
  category?: string;
  sizeChartUrl?: string;
  customFields?: Prisma.InputJsonValue;
  imageUrl?: string;
  imageFileBuffer?: Buffer;
}) {
  await assertStoreOwnership(input.userId, input.storeId);

  let imageUrl = input.imageUrl;
  if (!imageUrl && input.imageFileBuffer) {
    const result = await uploadImageBuffer(input.imageFileBuffer);
    imageUrl = result.url;
  }
  if (!imageUrl) {
    throw new ApiError(400, "image or image_url is required");
  }

  const product = await prisma.product.upsert({
    where: {
      storeId_productId: {
        storeId: input.storeId,
        productId: input.productId,
      },
    },
    update: {
      name: input.name,
      brand: input.brand,
      cost: input.cost,
      imageUrl,
      category: input.category ?? null,
      sizeChartUrl: input.sizeChartUrl ?? null,
      customFields:
        input.customFields ?? Prisma.JsonNull,
    },
    create: {
      storeId: input.storeId,
      productId: input.productId,
      name: input.name,
      brand: input.brand,
      cost: input.cost,
      imageUrl,
      category: input.category ?? null,
      sizeChartUrl: input.sizeChartUrl ?? null,
      customFields:
        input.customFields ?? Prisma.JsonNull,
    },
  });

  return {
    vizzle_product_id: product.id,
    image_url: product.imageUrl,
  };
}

export async function bulkImportProducts(input: {
  userId: string;
  storeId: string;
  products: Array<{
    id: string;
    name: string;
    brand?: string;
    cost: number;
    image_url: string;
    category?: string;
    size_chart_url?: string;
      custom_fields?: Prisma.InputJsonValue;
  }>;
}) {
  await assertStoreOwnership(input.userId, input.storeId);
  const limited = input.products.slice(0, 1000);
  let imported = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const item of limited) {
    try {
      await prisma.product.upsert({
        where: {
          storeId_productId: {
            storeId: input.storeId,
            productId: item.id,
          },
        },
        update: {
          name: item.name,
          brand: item.brand ?? "Unknown",
          cost: item.cost,
          imageUrl: item.image_url,
          category: item.category ?? null,
          sizeChartUrl: item.size_chart_url ?? null,
          customFields: item.custom_fields ?? Prisma.JsonNull,
        },
        create: {
          storeId: input.storeId,
          productId: item.id,
          name: item.name,
          brand: item.brand ?? "Unknown",
          cost: item.cost,
          imageUrl: item.image_url,
          category: item.category ?? null,
          sizeChartUrl: item.size_chart_url ?? null,
          customFields: item.custom_fields ?? Prisma.JsonNull,
        },
      });
      imported += 1;
    } catch (error) {
      errors.push({
        id: item.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    imported,
    errors,
  };
}

export async function resolveProductImageByStoreAndSku(input: {
  storeId: string;
  productId: string;
}) {
  const product = await prisma.product.findUnique({
    where: {
      storeId_productId: {
        storeId: input.storeId,
        productId: input.productId,
      },
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}
