"use client";

import type { SpecValueInput } from "@bomberman/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useCarSpecs(carId: string) {
  return useQuery({
    queryKey: queryKeys.cars.specs(carId),
    queryFn: () => apiClient.cars.listSpecs(carId),
    enabled: carId.length > 0,
  });
}

export function useSetCarSpec(carId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SpecValueInput) => apiClient.cars.setSpec(carId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.specs(carId) });
    },
  });
}
