const MAX_EDGE = 1600;
const DEFAULT_QUALITY = 0.78;

export interface CompressImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
}

export async function compressImage(file: File): Promise<CompressImageResult> {
  const originalSize = file.size;
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return { file, originalSize, compressedSize: originalSize };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

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

    const outputType =
      file.type === "image/png" || file.type === "image/jpeg" ? "image/webp" : file.type;
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, DEFAULT_QUALITY);
    });

    if (!blob || blob.size >= originalSize) {
      return { file, originalSize, compressedSize: originalSize };
    }

    const extension = outputType.split("/")[1] ?? "jpg";
    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
      type: outputType,
      lastModified: file.lastModified,
    });

    return { file: compressed, originalSize, compressedSize: compressed.size };
  } catch {
    return { file, originalSize, compressedSize: originalSize };
  }
}
