import { NotFoundError } from "@/common/errors";

import { uploadsCleanupRepository } from "../repositories/uploads-cleanup.repository";
import { uploadsRepository } from "../repositories/uploads.repository";
import { deleteObject } from "../utils/s3";

export class UploadCleanupService {
  async removeUpload(id: string): Promise<void> {
    const upload = await uploadsRepository.findById(id);
    if (!upload) {
      throw new NotFoundError("Upload", id);
    }
    await uploadsCleanupRepository.deleteUploadRecord(id);
    await deleteObject(upload.bucketKey);
  }

  async removeUploads(ids: Iterable<string>): Promise<void> {
    const unique = [...new Set(ids)].filter(Boolean);
    for (const id of unique) {
      const upload = await uploadsRepository.findById(id);
      if (!upload) {
        continue;
      }
      await uploadsCleanupRepository.deleteUploadRecord(id);
      await deleteObject(upload.bucketKey);
    }
  }
}

export const uploadCleanupService = new UploadCleanupService();
