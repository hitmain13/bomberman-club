"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function usePartCategories() {
  return useQuery({
    queryKey: queryKeys.catalog.partCategories(),
    queryFn: () => apiClient.catalog.partCategories(),
    staleTime: 30 * 60 * 1000,
  });
}

export function usePartsByCategory(categoryId: string | null) {
  return useQuery({
    queryKey: queryKeys.catalog.partsByCategory(categoryId ?? ""),
    queryFn: () => apiClient.catalog.partsByCategory(categoryId ?? ""),
    enabled: Boolean(categoryId),
    staleTime: 30 * 60 * 1000,
  });
}

export function useSpecDefinitions() {
  return useQuery({
    queryKey: queryKeys.catalog.specDefinitions(),
    queryFn: () => apiClient.catalog.specDefinitions(),
    staleTime: 30 * 60 * 1000,
  });
}
