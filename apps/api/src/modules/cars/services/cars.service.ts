import type { CarInput, CarResponse } from "@bomberman/types";

import { ForbiddenError, NotFoundError } from "@/common/errors";
import { garagesService } from "@/modules/garages";

import { CarBuilder } from "../builders/car.builder";
import { toCarResponse } from "../mappers/cars.mapper";
import { carsRepository } from "../repositories/cars.repository";

function ensureOwner<T extends { garageId: string }>(
  car: T,
  ownedGarageIds: ReadonlySet<string>,
): T {
  if (!ownedGarageIds.has(car.garageId)) {
    throw new ForbiddenError("Você não pode modificar este carro.");
  }
  return car;
}

export class CarsService {
  async listMine(userId: string): Promise<CarResponse[]> {
    const cars = await carsRepository.listByOwnerId(userId);
    return cars.map(toCarResponse);
  }

  async listByUsername(username: string): Promise<CarResponse[]> {
    const cars = await carsRepository.listByOwnerUsername(username);
    return cars.map(toCarResponse);
  }

  async getById(id: string): Promise<CarResponse> {
    const car = await carsRepository.findById(id);
    if (!car) {
      throw new NotFoundError("Car", id);
    }
    return toCarResponse(car);
  }

  async create(userId: string, input: CarInput): Promise<CarResponse> {
    const garage = await garagesService.ensurePrimary(userId);
    if (input.garageId !== garage.id) {
      throw new ForbiddenError("Garagem inválida.");
    }
    const data = new CarBuilder()
      .forGarage(garage.id)
      .named(input.nickname)
      .ofModel(input.brand, input.model, input.generation ?? null)
      .ofYear(input.year)
      .withFuel(input.fuel)
      .withEngine(input.engine)
      .withWeight(input.weightKg)
      .withPower(input.horsepowerHp, input.torqueNm)
      .withKm(input.currentKm)
      .withPlate(input.plate ?? null)
      .build();
    const created = await carsRepository.create(data);
    return toCarResponse(created);
  }

  async update(userId: string, id: string, input: CarInput): Promise<CarResponse> {
    const existing = await carsRepository.findByIdForOwner(id, userId);
    if (!existing) {
      throw new NotFoundError("Car", id);
    }
    ensureOwner(existing, new Set([existing.garageId]));
    const updated = await carsRepository.update(id, {
      nickname: input.nickname,
      brand: input.brand,
      model: input.model,
      generation: input.generation ?? null,
      year: input.year,
      fuel: input.fuel,
      engine: input.engine,
      weightKg: input.weightKg,
      horsepowerHp: input.horsepowerHp,
      torqueNm: input.torqueNm,
      currentKm: input.currentKm,
      plate: input.plate ?? null,
    });
    return toCarResponse(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await carsRepository.findByIdForOwner(id, userId);
    if (!existing) {
      throw new NotFoundError("Car", id);
    }
    await carsRepository.remove(id);
  }
}

export const carsService = new CarsService();
