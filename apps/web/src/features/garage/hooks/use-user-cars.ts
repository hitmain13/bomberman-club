"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useUserCars(username: string) {
  return useQuery({
    queryKey: queryKeys.cars.byUser(username),
    queryFn: () => apiClient.cars.listByUser(username),
    enabled: username.length > 0,
  });
}
