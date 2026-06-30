import type { Part, PartCategory, SpecificationDefinition } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class CatalogRepository {
  listPartCategories(): Promise<PartCategory[]> {
    return prisma.partCategory.findMany({ orderBy: { name: "asc" } });
  }

  listPartsByCategory(categoryId: string): Promise<Part[]> {
    return prisma.part.findMany({
      where: { categoryId },
      orderBy: [{ manufacturer: "asc" }, { name: "asc" }],
    });
  }

  listSpecDefinitions(): Promise<SpecificationDefinition[]> {
    return prisma.specificationDefinition.findMany({ orderBy: { name: "asc" } });
  }

  findPartCategoryById(id: string): Promise<PartCategory | null> {
    return prisma.partCategory.findUnique({ where: { id } });
  }

  findPartById(id: string): Promise<Part | null> {
    return prisma.part.findUnique({ where: { id } });
  }

  findSpecDefinitionById(id: string): Promise<SpecificationDefinition | null> {
    return prisma.specificationDefinition.findUnique({ where: { id } });
  }
}

export const catalogRepository = new CatalogRepository();
