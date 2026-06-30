import type { CarPartResponse } from "@bomberman/types";

import type { CarPartWithRelations } from "../repositories/car-parts.repository";

export function toCarPartResponse(carPart: CarPartWithRelations): CarPartResponse {
  return {
    id: carPart.id,
    installedAt: carPart.installedAt?.toISOString() ?? null,
    description: carPart.description,
    part: {
      id: carPart.part.id,
      categoryId: carPart.part.categoryId,
      manufacturer: carPart.part.manufacturer,
      name: carPart.part.name,
    },
    category: {
      id: carPart.part.category.id,
      slug: carPart.part.category.slug,
      name: carPart.part.category.name,
    },
  };
}
