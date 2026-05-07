"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client/fetcher";
import { AnalyticsData } from "@/types";

export const analyticsQueryKey = (
  storeId: string,
  from?: string,
  to?: string
) => ["analytics", storeId, from ?? "default", to ?? "default"];

export function useAnalyticsQuery(
  storeId: string | null,
  from?: string,
  to?: string
) {
  return useQuery({
    queryKey: analyticsQueryKey(storeId ?? "none", from, to),
    queryFn: () => {
      const params = new URLSearchParams({ store_id: storeId ?? "" });
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      return apiFetch<AnalyticsData>(`/analytics?${params.toString()}`);
    },
    enabled: !!storeId,
  });
}
