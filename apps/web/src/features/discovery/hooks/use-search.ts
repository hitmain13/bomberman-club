"use client";

import type { SearchType } from "@bomberman/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useSearch(query: string, type: SearchType) {
  const enabled = query.trim().length > 0;
  return useQuery({
    queryKey: queryKeys.discovery.search(query, type),
    queryFn: () => apiClient.discovery.search(query, type),
    enabled,
  });
}
