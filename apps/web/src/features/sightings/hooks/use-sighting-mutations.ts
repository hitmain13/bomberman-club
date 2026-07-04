"use client";

import type { SightingInput, SightingUpdateInput } from "@bomberman/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useUploadImage } from "@/shared/hooks/use-upload-image";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";
import { compressImage } from "@/shared/utils/compress-image";

export { useUploadImage };

export function useUploadImages() {
  const upload = useUploadImage();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const ids: string[] = [];
      for (const file of files) {
        const { file: compressed } = await compressImage(file);
        const result = await upload.mutateAsync(compressed);
        ids.push(result.id);
      }
      return ids;
    },
  });
}

export function useCreateSighting() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: SightingInput) => apiClient.sightings.create(input),
    onSuccess: (sighting) => {
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
      queryClient.invalidateQueries({ queryKey: ["discovery"] });
      queryClient.setQueryData(queryKeys.sightings.detail(sighting.id), sighting);
      router.replace(`/sightings/${sighting.id}`);
    },
  });
}

export function useUpdateSighting(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: SightingUpdateInput) => apiClient.sightings.update(id, input),
    onSuccess: (sighting) => {
      queryClient.setQueryData(queryKeys.sightings.detail(id), sighting);
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
      queryClient.invalidateQueries({ queryKey: ["discovery"] });
      router.replace(`/sightings/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["discovery"] });
      router.replace("/sightings");
    },
  });
}
