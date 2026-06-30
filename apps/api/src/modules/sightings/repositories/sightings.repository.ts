import type { Sighting, Upload, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type SightingWithRelations = Sighting & {
  upload: Upload;
  user: User & { avatar: Upload | null };
};

const includeRelations = {
  upload: true,
  user: { include: { avatar: true } },
} as const;

export class SightingsRepository {
  list(params: {
    after: Date | null;
    cursor: string | null;
    limit: number;
  }): Promise<SightingWithRelations[]> {
    return prisma.sighting.findMany({
      where: params.after ? { occurredAt: { gte: params.after } } : {},
      include: includeRelations,
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: params.limit + 1,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    });
  }

  findById(id: string): Promise<SightingWithRelations | null> {
    return prisma.sighting.findUnique({ where: { id }, include: includeRelations });
  }

  create(data: {
    userId: string;
    uploadId: string;
    title: string;
    description: string | null;
    latitude: number;
    longitude: number;
    occurredAt: Date;
  }): Promise<SightingWithRelations> {
    return prisma.sighting.create({ data, include: includeRelations });
  }

  remove(id: string): Promise<Sighting> {
    return prisma.sighting.delete({ where: { id } });
  }
}

export const sightingsRepository = new SightingsRepository();
