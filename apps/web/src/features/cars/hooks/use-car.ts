"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useCar(id: string) {
  return useQuery({
    queryKey: queryKeys.cars.detail(id),
    queryFn: () => apiClient.cars.get(id),
    enabled: id.length > 0,
  });
}
