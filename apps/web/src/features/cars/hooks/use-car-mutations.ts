"use client";

import type { CarInput } from "@bomberman/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useCreateCar() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: CarInput) => apiClient.cars.create(input),
    onSuccess: (car) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.mine() });
      queryClient.setQueryData(queryKeys.cars.detail(car.id), car);
      router.replace(`/cars/${car.id}`);
    },
  });
}

export function useUpdateCar(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: CarInput) => apiClient.cars.update(id, input),
    onSuccess: (car) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.mine() });
      queryClient.setQueryData(queryKeys.cars.detail(car.id), car);
      router.replace(`/cars/${car.id}`);
    },
  });
}

export function useDeleteCar(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => apiClient.cars.remove(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.cars.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.mine() });
      router.replace("/me/cars");
    },
  });
}
