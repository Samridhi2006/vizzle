"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client/fetcher";
import { Store } from "@/types";
import { useAuthStore } from "@/store/auth.store";

export const storesQueryKey = ["stores"];

export function useStoresQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: storesQueryKey,
    queryFn: () => apiFetch<{ stores: Store[] }>("/stores"),
    enabled: !!token,
  });
}

export function useCreateStoreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { store_name: string; domain: string }) =>
      apiFetch<{ store_id: string; api_key: string }>("/stores", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storesQueryKey });
    },
  });
}

export function useRotateApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeId: string) =>
      apiFetch<{ new_api_key: string }>("/api-keys/rotate", {
        method: "POST",
        body: JSON.stringify({ store_id: storeId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storesQueryKey });
    },
  });
}
