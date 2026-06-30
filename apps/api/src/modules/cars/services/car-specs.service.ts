import {
  type SpecValueInput,
  type SpecValueResponse,
  validateSpecValueInput,
} from "@bomberman/types";

import { ForbiddenError, NotFoundError, ValidationError } from "@/common/errors";
import { catalogRepository } from "@/modules/catalog";
import { toSpecDefinitionDto } from "@/modules/catalog/mappers/catalog.mapper";

import { toSpecValueResponse } from "../mappers/car-specs.mapper";
import { carSpecsRepository } from "../repositories/car-specs.repository";
import { carsRepository } from "../repositories/cars.repository";

async function ensureCarOwnership(carId: string, userId: string): Promise<void> {
  const car = await carsRepository.findByIdForOwner(carId, userId);
  if (!car) {
    throw new ForbiddenError("Você não pode modificar este carro.");
  }
}

function splitValue(
  value: string | number | boolean,
  type: "STRING" | "NUMBER" | "BOOLEAN" | "ENUM",
): { valueString: string | null; valueNumber: number | null; valueBoolean: boolean | null } {
  if (type === "NUMBER") {
    return { valueString: null, valueNumber: value as number, valueBoolean: null };
  }
  if (type === "BOOLEAN") {
    return { valueString: null, valueNumber: null, valueBoolean: value as boolean };
  }
  return { valueString: value as string, valueNumber: null, valueBoolean: null };
}

export class CarSpecsService {
  async list(carId: string): Promise<SpecValueResponse[]> {
    const car = await carsRepository.findById(carId);
    if (!car) {
      throw new NotFoundError("Car", carId);
    }
    const values = await carSpecsRepository.listByCarId(carId);
    return values.map(toSpecValueResponse);
  }

  async set(carId: string, userId: string, input: SpecValueInput): Promise<SpecValueResponse> {
    await ensureCarOwnership(carId, userId);
    const definition = await catalogRepository.findSpecDefinitionById(input.definitionId);
    if (!definition) {
      throw new NotFoundError("SpecificationDefinition", input.definitionId);
    }
    const validation = validateSpecValueInput(toSpecDefinitionDto(definition), input.value);
    if (!validation.ok) {
      throw new ValidationError(validation.message);
    }
    const columns = splitValue(input.value, definition.type);
    const saved = await carSpecsRepository.upsert({
      carId,
      definitionId: definition.id,
      ...columns,
    });
    return toSpecValueResponse(saved);
  }
}

export const carSpecsService = new CarSpecsService();
