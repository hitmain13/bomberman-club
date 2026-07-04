import {
  type Part,
  type PartCategory,
  type SpecDefinition,
  partCategorySchema,
  partSchema,
  specDefinitionSchema,
} from "@bomberman/types";
import type { SpecificationDefinition } from "@prisma/client";
import { z } from "zod";

import { NotFoundError } from "@/common/errors";
import { parseOrThrow } from "@/common/validation";

import {
  toPartCategoryDto,
  toPartDto,
  toSpecDefinitionDto,
} from "@/modules/catalog/mappers/catalog.mapper";
import { catalogRepository } from "@/modules/catalog/repositories/catalog.repository";

const partCategoryInputSchema = partCategorySchema.pick({ slug: true, name: true });
const partCategoryUpdateSchema = partCategoryInputSchema.partial();
const partInputSchema = partSchema.pick({ categoryId: true, manufacturer: true, name: true });
const partUpdateSchema = partInputSchema.partial();
const specDefinitionInputSchema = specDefinitionSchema.omit({ id: true }).extend({
  enumOptions: z.array(z.string()).optional().nullable(),
});
const specDefinitionUpdateSchema = specDefinitionInputSchema.partial();

function omitUndefined<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export class AdminCatalogService {
  listPartCategories(): Promise<PartCategory[]> {
    return catalogRepository.listPartCategories().then((rows) => rows.map(toPartCategoryDto));
  }

  createPartCategory(input: unknown): Promise<PartCategory> {
    const data = parseOrThrow(partCategoryInputSchema, input);
    return catalogRepository.createPartCategory(data).then(toPartCategoryDto);
  }

  async updatePartCategory(id: string, input: unknown): Promise<PartCategory> {
    const existing = await catalogRepository.findPartCategoryById(id);
    if (!existing) {
      throw new NotFoundError("PartCategory", id);
    }
    const data = parseOrThrow(partCategoryUpdateSchema, input);
    return catalogRepository
      .updatePartCategory(id, omitUndefined(data) as { slug?: string; name?: string })
      .then(toPartCategoryDto);
  }

  async deletePartCategory(id: string): Promise<void> {
    const existing = await catalogRepository.findPartCategoryById(id);
    if (!existing) {
      throw new NotFoundError("PartCategory", id);
    }
    await catalogRepository.deletePartCategory(id);
  }

  listPartsByCategory(categoryId: string): Promise<Part[]> {
    return catalogRepository.listPartsByCategory(categoryId).then((rows) => rows.map(toPartDto));
  }

  createPart(input: unknown): Promise<Part> {
    const data = parseOrThrow(partInputSchema, input);
    return catalogRepository.createPart(data).then(toPartDto);
  }

  async updatePart(id: string, input: unknown): Promise<Part> {
    const existing = await catalogRepository.findPartById(id);
    if (!existing) {
      throw new NotFoundError("Part", id);
    }
    const data = parseOrThrow(partUpdateSchema, input);
    return catalogRepository
      .updatePart(
        id,
        omitUndefined(data) as { categoryId?: string; manufacturer?: string; name?: string },
      )
      .then(toPartDto);
  }

  async deletePart(id: string): Promise<void> {
    const existing = await catalogRepository.findPartById(id);
    if (!existing) {
      throw new NotFoundError("Part", id);
    }
    await catalogRepository.deletePart(id);
  }

  listSpecDefinitions(): Promise<SpecDefinition[]> {
    return catalogRepository.listSpecDefinitions().then((rows) => rows.map(toSpecDefinitionDto));
  }

  createSpecDefinition(input: unknown): Promise<SpecDefinition> {
    const data = parseOrThrow(specDefinitionInputSchema, input);
    return catalogRepository
      .createSpecDefinition({
        ...data,
        unit: data.unit ?? null,
        category: data.category ?? null,
        enumOptions: data.enumOptions ?? [],
      })
      .then(toSpecDefinitionDto);
  }

  async updateSpecDefinition(id: string, input: unknown): Promise<SpecDefinition> {
    const existing = await catalogRepository.findSpecDefinitionById(id);
    if (!existing) {
      throw new NotFoundError("SpecificationDefinition", id);
    }
    const data = parseOrThrow(specDefinitionUpdateSchema, input);
    return catalogRepository
      .updateSpecDefinition(
        id,
        omitUndefined(data) as {
          key?: string;
          name?: string;
          type?: SpecificationDefinition["type"];
          unit?: string | null;
          category?: string | null;
          enumOptions?: string[];
        },
      )
      .then(toSpecDefinitionDto);
  }

  async deleteSpecDefinition(id: string): Promise<void> {
    const existing = await catalogRepository.findSpecDefinitionById(id);
    if (!existing) {
      throw new NotFoundError("SpecificationDefinition", id);
    }
    await catalogRepository.deleteSpecDefinition(id);
  }
}

export const adminCatalogService = new AdminCatalogService();
