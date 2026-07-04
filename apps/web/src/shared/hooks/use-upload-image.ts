"use client";

import type { UploadResponse } from "@bomberman/types";
import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { compressImage } from "@/shared/utils/compress-image";

export async function uploadImageFile(file: File): Promise<UploadResponse> {
  const { file: compressed } = await compressImage(file);
  return apiClient.uploads.upload(compressed, compressed.name);
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImageFile,
    scope: { id: "upload-image" },
  });
}
