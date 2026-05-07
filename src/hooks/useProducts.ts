"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client/fetcher";
import { Product } from "@/types";

export const productsQueryKey = (storeId: string) => ["products", storeId];

export function useProductsQuery(storeId: string | null) {
  return useQuery({
    queryKey: productsQueryKey(storeId ?? "none"),
    queryFn: () =>
      apiFetch<{ products: Product[] }>(`/products?store_id=${storeId}`),
    enabled: !!storeId,
  });
}

export function useCreateProductMutation(storeId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      product_id: string;
      name: string;
      brand: string;
      cost: number;
      image_url: string;
      category?: string;
      size_chart_url?: string;
      custom_fields?: Record<string, unknown>;
    }) =>
      apiFetch<{ vizzle_product_id: string; image_url: string }>("/products", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          store_id: storeId,
        }),
      }),
    onSuccess: () => {
      if (storeId) {
        queryClient.invalidateQueries({
          queryKey: productsQueryKey(storeId),
        });
      }
    },
  });
}

export function useBulkProductsMutation(storeId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (products: Array<Record<string, unknown>>) =>
      apiFetch<{ imported: number; errors: Array<{ id: string; error: string }> }>(
        "/products/bulk",
        {
          method: "POST",
          body: JSON.stringify({
            store_id: storeId,
            products,
          }),
        }
      ),
    onSuccess: () => {
      if (storeId) {
        queryClient.invalidateQueries({
          queryKey: productsQueryKey(storeId),
        });
      }
    },
  });
}
