"use client";

import { ApiError } from "@bomberman/sdk";
import type { UploadResponse } from "@bomberman/types";
import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";
import { compressImage } from "@/shared/utils/compress-image";

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) {
    return RETRYABLE_STATUS_CODES.has(error.status);
  }
  return !(error instanceof ApiError);
}

async function uploadImageFileWithRetry(file: File, attempt: number): Promise<UploadResponse> {
  try {
    const { file: compressed } = await compressImage(file);
    return await apiClient.uploads.upload(compressed, compressed.name);
  } catch (error) {
    if (attempt < 3 && isRetryable(error)) {
      await sleep(500 * attempt);
      return uploadImageFileWithRetry(file, attempt + 1);
    }
    throw error;
  }
}

export async function uploadImageFile(file: File): Promise<UploadResponse> {
  return uploadImageFileWithRetry(file, 1);
}

export function errorMessageFromUpload(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Não foi possível enviar.";
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImageFile,
    scope: { id: "upload-image" },
  });
}
