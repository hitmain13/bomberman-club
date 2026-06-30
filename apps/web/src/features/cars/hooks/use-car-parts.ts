"use client";

import type { CarPartInput } from "@bomberman/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useCarParts(carId: string) {
  return useQuery({
    queryKey: queryKeys.cars.parts(carId),
    queryFn: () => apiClient.cars.listParts(carId),
    enabled: carId.length > 0,
  });
}

export function useAddCarPart(carId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CarPartInput) => apiClient.cars.addPart(carId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.parts(carId) });
    },
  });
}

export function useRemoveCarPart(carId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carPartId: string) => apiClient.cars.removePart(carId, carPartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.parts(carId) });
    },
  });
}
