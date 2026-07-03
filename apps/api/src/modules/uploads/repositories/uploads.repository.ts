import type { Upload } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class UploadsRepository {
  create(data: {
    ownerId: string;
    bucketKey: string;
    url: string;
    mime: string;
    size: number;
    width: number | null;
    height: number | null;
  }): Promise<Upload> {
    return prisma.upload.create({ data });
  }

  findById(id: string): Promise<Upload | null> {
    return prisma.upload.findUnique({ where: { id } });
  }

  remove(id: string): Promise<Upload> {
    return prisma.upload.delete({ where: { id } });
  }

  sumStoredBytes(): Promise<number> {
    return prisma.upload
      .aggregate({ _sum: { size: true } })
      .then((result) => result._sum.size ?? 0);
  }
}

export const uploadsRepository = new UploadsRepository();
