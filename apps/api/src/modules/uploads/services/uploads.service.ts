import { randomBytes } from "node:crypto";

import type { UploadResponse } from "@bomberman/types";
import type { Upload } from "@prisma/client";

import { ForbiddenError, NotFoundError, ValidationError } from "@/common/errors";

import { uploadsRepository } from "../repositories/uploads.repository";
import { type SupportedMime, detectMimeFromBytes } from "../utils/magic-number";
import { putObject } from "../utils/s3";

const MAX_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME: ReadonlyArray<SupportedMime> = ["image/jpeg", "image/png", "image/webp"];
const EXTENSION_BY_MIME: Record<SupportedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function toResponse(upload: Upload): UploadResponse {
  return {
    id: upload.id,
    url: upload.url,
    width: upload.width,
    height: upload.height,
    mime: upload.mime,
  };
}

export class UploadsService {
  async upload(ownerId: string, file: File): Promise<UploadResponse> {
    if (file.size > MAX_SIZE_BYTES) {
      throw new ValidationError("Arquivo excede o tamanho máximo (15 MB).");
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const detected = detectMimeFromBytes(buffer);
    if (!detected) {
      throw new ValidationError("Conteúdo do arquivo não é uma imagem suportada.");
    }
    if (!ALLOWED_MIME.includes(detected)) {
      throw new ValidationError("Mime não permitido.");
    }
    if (file.type && file.type !== detected) {
      throw new ValidationError("Mime declarado divergente do conteúdo.");
    }

    const extension = EXTENSION_BY_MIME[detected];
    const bucketKey = `u/${ownerId}/${Date.now()}-${randomBytes(8).toString("hex")}.${extension}`;
    const { url } = await putObject(bucketKey, buffer, detected);

    const saved = await uploadsRepository.create({
      ownerId,
      bucketKey,
      url,
      mime: detected,
      size: file.size,
      width: null,
      height: null,
    });
    return toResponse(saved);
  }

  async get(id: string): Promise<UploadResponse> {
    const upload = await uploadsRepository.findById(id);
    if (!upload) {
      throw new NotFoundError("Upload", id);
    }
    return toResponse(upload);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const upload = await uploadsRepository.findById(id);
    if (!upload) {
      throw new NotFoundError("Upload", id);
    }
    if (upload.ownerId !== ownerId) {
      throw new ForbiddenError("Você não pode remover este upload.");
    }
    await uploadsRepository.remove(id);
  }
}

export const uploadsService = new UploadsService();
