"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useGeoSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.geo.search(query),
    queryFn: () => apiClient.geo.search(query),
    enabled: query.trim().length >= 3,
    staleTime: 60_000,
  });
}
