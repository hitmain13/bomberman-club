import type { CarPartInput, CarPartResponse } from "@bomberman/types";
import type { Part } from "@prisma/client";

import { ForbiddenError, NotFoundError, ValidationError } from "@/common/errors";
import { catalogRepository } from "@/modules/catalog";

import { toCarPartResponse } from "../mappers/car-parts.mapper";
import { carPartsRepository } from "../repositories/car-parts.repository";
import { carsRepository } from "../repositories/cars.repository";

async function ensureCarOwnership(carId: string, userId: string): Promise<void> {
  const car = await carsRepository.findByIdForOwner(carId, userId);
  if (!car) {
    throw new ForbiddenError("Você não pode modificar este carro.");
  }
}

async function resolvePart(input: CarPartInput): Promise<Part> {
  if (input.partId) {
    const part = await catalogRepository.findPartById(input.partId);
    if (!part) {
      throw new NotFoundError("Part", input.partId);
    }
    return part;
  }
  if (!input.categoryId || !input.manufacturer || !input.name) {
    throw new ValidationError(
      "Selecione uma peça existente ou informe fabricante e nome para cadastrar uma nova.",
    );
  }
  const category = await catalogRepository.findPartCategoryById(input.categoryId);
  if (!category) {
    throw new NotFoundError("PartCategory", input.categoryId);
  }
  return catalogRepository.findOrCreatePart({
    categoryId: category.id,
    manufacturer: input.manufacturer,
    name: input.name,
  });
}

export class CarPartsService {
  async list(carId: string): Promise<CarPartResponse[]> {
    const carExists = await carsRepository.findById(carId);
    if (!carExists) {
      throw new NotFoundError("Car", carId);
    }
    const parts = await carPartsRepository.listByCarId(carId);
    return parts.map(toCarPartResponse);
  }

  async add(carId: string, userId: string, input: CarPartInput): Promise<CarPartResponse> {
    await ensureCarOwnership(carId, userId);
    const part = await resolvePart(input);
    const created = await carPartsRepository.add({
      carId,
      partId: part.id,
      installedAt: input.installedAt ? new Date(input.installedAt) : null,
      description: input.description ?? null,
    });
    return toCarPartResponse(created);
  }

  async remove(carId: string, userId: string, carPartId: string): Promise<void> {
    await ensureCarOwnership(carId, userId);
    const existing = await carPartsRepository.findById(carPartId);
    if (!existing || existing.carId !== carId) {
      throw new NotFoundError("CarPart", carPartId);
    }
    await carPartsRepository.remove(carPartId);
  }
}

export const carPartsService = new CarPartsService();
