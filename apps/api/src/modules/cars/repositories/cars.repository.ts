import type { Car, Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type CarWithCover = Car & { cover: { url: string } | null };

const includeCover = { cover: { select: { url: true } } } as const;

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

  findById(id: string): Promise<CarWithCover | null> {
    return prisma.car.findUnique({ where: { id }, include: includeCover });
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
