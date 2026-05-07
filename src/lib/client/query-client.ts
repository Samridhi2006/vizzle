import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (queryClient) return queryClient;

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,        // data stays fresh for 1 min
        gcTime: 5 * 60_000,       // keep unused cache for 5 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  });

  return queryClient;
}
