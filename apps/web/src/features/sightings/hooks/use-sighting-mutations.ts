"use client";

import type { SightingInput } from "@bomberman/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useCreateSighting() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: SightingInput) => apiClient.sightings.create(input),
    onSuccess: (sighting) => {
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
      queryClient.setQueryData(queryKeys.sightings.detail(sighting.id), sighting);
      router.replace(`/sightings/${sighting.id}`);
    },
  });
}

export function useDeleteSighting(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => apiClient.sightings.remove(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.sightings.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
      router.replace("/sightings");
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => apiClient.uploads.upload(file, file.name),
  });
}
