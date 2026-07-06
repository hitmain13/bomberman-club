import type { Car, Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type CarWithCover = Car & { cover: { url: string } | null };
export type CarWithOwner = CarWithCover & { garage: { userId: string } };

const includeCover = { cover: { select: { url: true } } } as const;
const includeWithOwner = { ...includeCover, garage: { select: { userId: true } } } as const;

export class CarsRepository {
  listByOwnerId(userId: string): Promise<CarWithCover[]> {
    return prisma.car.findMany({
      where: { garage: { userId } },
      include: includeCover,
      orderBy: [{ updatedAt: "desc" }],
    });
  }

  listByOwnerUsername(username: string): Promise<CarWithCover[]> {
    return prisma.car.findMany({
      where: { garage: { user: { username } } },
      include: includeCover,
      orderBy: [{ updatedAt: "desc" }],
    });
  }

  listIdsByOwnerUsername(username: string): Promise<string[]> {
    return prisma.car
      .findMany({ where: { garage: { user: { username } } }, select: { id: true } })
      .then((rows) => rows.map((row) => row.id));
  }

  findManyByIds(ids: string[]): Promise<CarWithCover[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.car.findMany({ where: { id: { in: ids } }, include: includeCover });
  }

  findOwnerId(carId: string): Promise<string | null> {
    return prisma.car
      .findUnique({ where: { id: carId }, select: { garage: { select: { userId: true } } } })
      .then((row) => row?.garage.userId ?? null);
  }

  findById(id: string): Promise<CarWithCover | null> {
    return prisma.car.findUnique({ where: { id }, include: includeCover });
  }

  findByIdWithOwner(id: string): Promise<CarWithOwner | null> {
    return prisma.car.findUnique({ where: { id }, include: includeWithOwner });
  }

  findByIdForOwner(id: string, userId: string): Promise<CarWithCover | null> {
    return prisma.car.findFirst({
      where: { id, garage: { userId } },
      include: includeCover,
    });
  }

  create(data: Prisma.CarUncheckedCreateInput): Promise<CarWithCover> {
    return prisma.car.create({ data, include: includeCover });
  }

  update(id: string, data: Prisma.CarUncheckedUpdateInput): Promise<CarWithCover> {
    return prisma.car.update({ where: { id }, data, include: includeCover });
  }

  remove(id: string): Promise<Car> {
    return prisma.car.delete({ where: { id } });
  }
}

export const carsRepository = new CarsRepository();
