import type { CarSpecificationValue, SpecificationDefinition } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type CarSpecValueWithDefinition = CarSpecificationValue & {
  definition: SpecificationDefinition;
};

const includeDefinition = { definition: true } as const;

export class CarSpecsRepository {
  listByCarId(carId: string): Promise<CarSpecValueWithDefinition[]> {
    return prisma.carSpecificationValue.findMany({
      where: { carId },
      include: includeDefinition,
      orderBy: { definition: { name: "asc" } },
    });
  }

  upsert(data: {
    carId: string;
    definitionId: string;
    valueString: string | null;
    valueNumber: number | null;
    valueBoolean: boolean | null;
  }): Promise<CarSpecValueWithDefinition> {
    return prisma.carSpecificationValue.upsert({
      where: { carId_definitionId: { carId: data.carId, definitionId: data.definitionId } },
      create: data,
      update: {
        valueString: data.valueString,
        valueNumber: data.valueNumber,
        valueBoolean: data.valueBoolean,
      },
      include: includeDefinition,
    });
  }
}

export const carSpecsRepository = new CarSpecsRepository();
