import type { CarResponse } from "@bomberman/types";

import type { CarWithCover } from "../repositories/cars.repository";

export function toCarResponse(car: CarWithCover): CarResponse {
  return {
    id: car.id,
    garageId: car.garageId,
    nickname: car.nickname,
    brand: car.brand,
    model: car.model,
    generation: car.generation,
    year: car.year,
    fuel: car.fuel,
    engine: car.engine,
    weightKg: car.weightKg,
    horsepowerHp: car.horsepowerHp,
    torqueNm: car.torqueNm,
    currentKm: car.currentKm,
    plate: car.plate,
    coverUploadId: car.coverUploadId,
    coverUrl: car.cover?.url ?? null,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  };
}
