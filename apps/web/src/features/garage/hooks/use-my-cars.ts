"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/shared/contexts/auth-context";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useMyCars() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.cars.mine(),
    queryFn: () => apiClient.cars.listMine(),
    enabled: isAuthenticated,
  });
}
