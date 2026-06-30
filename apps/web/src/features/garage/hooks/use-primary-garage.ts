"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/shared/contexts/auth-context";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function usePrimaryGarage() {
  const { isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: queryKeys.garages.mine(),
    queryFn: () => apiClient.garages.listMine(),
    enabled: isAuthenticated,
  });
  const primary = query.data?.find((garage) => garage.isPrimary) ?? query.data?.[0] ?? null;
  return { ...query, primary };
}
