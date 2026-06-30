import type { SpecValueResponse } from "@bomberman/types";

import { toSpecDefinitionDto } from "@/modules/catalog/mappers/catalog.mapper";

import type { CarSpecValueWithDefinition } from "../repositories/car-specs.repository";

export function toSpecValueResponse(value: CarSpecValueWithDefinition): SpecValueResponse {
  return {
    id: value.id,
    definition: toSpecDefinitionDto(value.definition),
    valueString: value.valueString,
    valueNumber: value.valueNumber,
    valueBoolean: value.valueBoolean,
  };
}
