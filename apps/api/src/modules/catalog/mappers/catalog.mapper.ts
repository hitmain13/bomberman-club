import type {
  PartCategory as PartCategoryDto,
  Part as PartDto,
  SpecDefinition,
} from "@bomberman/types";
import type { Part, PartCategory, SpecificationDefinition } from "@prisma/client";

export function toPartCategoryDto(category: PartCategory): PartCategoryDto {
  return { id: category.id, slug: category.slug, name: category.name };
}

export function toPartDto(part: Part): PartDto {
  return {
    id: part.id,
    categoryId: part.categoryId,
    manufacturer: part.manufacturer,
    name: part.name,
  };
}

export function toSpecDefinitionDto(definition: SpecificationDefinition): SpecDefinition {
  return {
    id: definition.id,
    key: definition.key,
    name: definition.name,
    type: definition.type,
    unit: definition.unit,
    category: definition.category,
    enumOptions: definition.enumOptions.length > 0 ? definition.enumOptions : null,
  };
}
