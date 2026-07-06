const MAX_EDGE = 1400;
const DEFAULT_QUALITY = 0.72;
const MIN_DIMENSION_REDUCTION = 0.9;

export interface CompressImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
}

function shouldUseCompressed(
  originalSize: number,
  blob: Blob,
  originalMaxEdge: number,
  outputMaxEdge: number,
): boolean {
  if (blob.size < originalSize) {
    return true;
  }
  return outputMaxEdge < originalMaxEdge * MIN_DIMENSION_REDUCTION;
}

export async function compressImage(file: File): Promise<CompressImageResult> {
  const originalSize = file.size;
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return { file, originalSize, compressedSize: originalSize };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const originalMaxEdge = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, MAX_EDGE / originalMaxEdge);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const outputMaxEdge = Math.max(width, height);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { file, originalSize, compressedSize: originalSize };
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const outputType = "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, DEFAULT_QUALITY);
    });

    if (!blob || !shouldUseCompressed(originalSize, blob, originalMaxEdge, outputMaxEdge)) {
      return { file, originalSize, compressedSize: originalSize };
    }

    const extension = "webp";
    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
      type: outputType,
      lastModified: file.lastModified,
    });

    return { file: compressed, originalSize, compressedSize: compressed.size };
  } catch {
    return { file, originalSize, compressedSize: originalSize };
  }
}
