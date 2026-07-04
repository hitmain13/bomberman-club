"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { compressImage } from "@/shared/utils/compress-image";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const { file: compressed } = await compressImage(file);
      return apiClient.uploads.upload(compressed, compressed.name);
    },
  });
}
