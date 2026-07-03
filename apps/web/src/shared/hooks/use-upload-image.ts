"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => apiClient.uploads.upload(file, file.name),
  });
}
