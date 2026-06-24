import { assertStoreOwnership } from "@/server/services/products.service";
import type { SyncProductsResponse } from "@/types";

/**
 * Shopify sync stub — implement:
 * 1. Read platform credentials from env or store settings (e.g. SHOPIFY_ACCESS_TOKEN, shop domain)
 * 2. Fetch products from Shopify Admin API
 * 3. Map to Vizzle shape: { id (SKU), name, brand, cost, image_url, category? }
 * 4. Upsert via bulkImportProducts or loop createOrUpdateProduct
 * 5. Return { imported, errors, source: "shopify" }
 */
export async function syncShopifyProducts(
  userId: string,
  storeId: string
): Promise<SyncProductsResponse> {
  await assertStoreOwnership(userId, storeId);

  return {
    status: "not_implemented",
    message:
      "Shopify sync stub — implement fetch + map + bulkImportProducts in this route.",
    imported: 0,
    errors: [],
    source: "shopify",
  };
}

/**
 * WordPress / WooCommerce sync stub — implement:
 * 1. Read WooCommerce REST credentials from env or store settings
 * 2. Fetch products from WooCommerce REST API
 * 3. Map to Vizzle shape: { id (SKU), name, brand, cost, image_url, category? }
 * 4. Upsert via bulkImportProducts or loop createOrUpdateProduct
 * 5. Return { imported, errors, source: "wordpress" }
 */
export async function syncWordPressProducts(
  userId: string,
  storeId: string
): Promise<SyncProductsResponse> {
  await assertStoreOwnership(userId, storeId);

  return {
    status: "not_implemented",
    message:
      "WordPress sync stub — implement fetch + map + bulkImportProducts in this route.",
    imported: 0,
    errors: [],
    source: "wordpress",
  };
}
