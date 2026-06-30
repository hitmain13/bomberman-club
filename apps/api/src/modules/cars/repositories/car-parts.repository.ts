import type { CarPart, Part, PartCategory } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type CarPartWithRelations = CarPart & {
  part: Part & { category: PartCategory };
};

const includeRelations = {
  part: { include: { category: true } },
} as const;

export class CarPartsRepository {
  listByCarId(carId: string): Promise<CarPartWithRelations[]> {
    return prisma.carPart.findMany({
      where: { carId },
      include: includeRelations,
      orderBy: [{ part: { category: { name: "asc" } } }, { createdAt: "asc" }],
    });
  }

  add(data: {
    carId: string;
    partId: string;
    installedAt: Date | null;
    description: string | null;
  }): Promise<CarPartWithRelations> {
    return prisma.carPart.create({
      data,
      include: includeRelations,
    });
  }

  remove(id: string): Promise<CarPart> {
    return prisma.carPart.delete({ where: { id } });
  }

  findById(id: string): Promise<CarPartWithRelations | null> {
    return prisma.carPart.findUnique({ where: { id }, include: includeRelations });
  }
}

export const carPartsRepository = new CarPartsRepository();
