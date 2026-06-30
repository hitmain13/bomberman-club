import type { Part, PartCategory, SpecDefinition } from "@bomberman/types";

import { toPartCategoryDto, toPartDto, toSpecDefinitionDto } from "../mappers/catalog.mapper";
import { catalogRepository } from "../repositories/catalog.repository";

export class CatalogService {
  async listPartCategories(): Promise<PartCategory[]> {
    const categories = await catalogRepository.listPartCategories();
    return categories.map(toPartCategoryDto);
  }

  async listPartsByCategory(categoryId: string): Promise<Part[]> {
    const parts = await catalogRepository.listPartsByCategory(categoryId);
    return parts.map(toPartDto);
  }

  async listSpecDefinitions(): Promise<SpecDefinition[]> {
    const definitions = await catalogRepository.listSpecDefinitions();
    return definitions.map(toSpecDefinitionDto);
  }
}

export const catalogService = new CatalogService();
