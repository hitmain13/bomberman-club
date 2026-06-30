import type { Garage } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class GaragesRepository {
  listByUserId(userId: string): Promise<Garage[]> {
    return prisma.garage.findMany({
      where: { userId },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    });
  }

  findPrimaryByUserId(userId: string): Promise<Garage | null> {
    return prisma.garage.findFirst({ where: { userId, isPrimary: true } });
  }

  createPrimary(userId: string): Promise<Garage> {
    return prisma.garage.create({
      data: { userId, name: "Principal", isPrimary: true },
    });
  }

  findByIdForOwner(id: string, userId: string): Promise<Garage | null> {
    return prisma.garage.findFirst({ where: { id, userId } });
  }
}

export const garagesRepository = new GaragesRepository();
