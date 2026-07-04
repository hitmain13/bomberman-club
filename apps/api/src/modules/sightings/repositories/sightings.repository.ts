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

  listByUsername(username: string): Promise<SightingWithRelations[]> {
    return prisma.sighting.findMany({
      where: { user: { username } },
      include: includeRelations,
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: 50,
    });
  }

  listIdsByUsername(username: string): Promise<string[]> {
    return prisma.sighting
      .findMany({ where: { user: { username } }, select: { id: true } })
      .then((rows) => rows.map((row) => row.id));
  }

  findManyByIds(ids: string[]): Promise<SightingWithRelations[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.sighting.findMany({ where: { id: { in: ids } }, include: includeRelations });
  }

  findOwnerId(sightingId: string): Promise<string | null> {
    return prisma.sighting
      .findUnique({ where: { id: sightingId }, select: { userId: true } })
      .then((row) => row?.userId ?? null);
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
    street: string | null;
    locationLabel: string | null;
    occurredAt: Date;
  }): Promise<SightingWithRelations> {
    return prisma.sighting.create({ data, include: includeRelations });
  }

  remove(id: string): Promise<Sighting> {
    return prisma.sighting.delete({ where: { id } });
  }
}

export const sightingsRepository = new SightingsRepository();
