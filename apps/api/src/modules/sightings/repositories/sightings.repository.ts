import type { Sighting, SightingImage, Upload, User } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type SightingImageWithUpload = SightingImage & { upload: Upload };

export type SightingWithRelations = Sighting & {
  upload: Upload;
  images: SightingImageWithUpload[];
  user: User & { avatar: Upload | null };
};

const includeRelations = {
  upload: true,
  images: { include: { upload: true }, orderBy: { position: "asc" as const } },
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
    uploadIds: string[];
    title: string;
    description: string | null;
    latitude: number;
    longitude: number;
    street: string | null;
    locationLabel: string | null;
    occurredAt: Date;
  }): Promise<SightingWithRelations> {
    return prisma.sighting.create({
      data: {
        userId: data.userId,
        uploadId: data.uploadId,
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        street: data.street,
        locationLabel: data.locationLabel,
        occurredAt: data.occurredAt,
        images: {
          create: data.uploadIds.map((uploadId, position) => ({ uploadId, position })),
        },
      },
      include: includeRelations,
    });
  }

  update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      latitude?: number;
      longitude?: number;
      street?: string | null;
      locationLabel?: string | null;
      occurredAt?: Date;
      uploadId?: string;
      uploadIds?: string[];
    },
  ): Promise<SightingWithRelations> {
    const imageUpdate =
      data.uploadIds !== undefined
        ? {
            deleteMany: {},
            create: data.uploadIds.map((uploadId, position) => ({ uploadId, position })),
          }
        : undefined;

    return prisma.sighting.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
        ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        ...(data.street !== undefined ? { street: data.street } : {}),
        ...(data.locationLabel !== undefined ? { locationLabel: data.locationLabel } : {}),
        ...(data.occurredAt !== undefined ? { occurredAt: data.occurredAt } : {}),
        ...(data.uploadId !== undefined ? { uploadId: data.uploadId } : {}),
        ...(imageUpdate ? { images: imageUpdate } : {}),
      },
      include: includeRelations,
    });
  }

  remove(id: string): Promise<Sighting> {
    return prisma.sighting.delete({ where: { id } });
  }
}

export const sightingsRepository = new SightingsRepository();
