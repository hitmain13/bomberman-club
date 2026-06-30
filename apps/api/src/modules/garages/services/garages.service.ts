import type { GarageResponse } from "@bomberman/types";
import type { Garage } from "@prisma/client";

import { garagesRepository } from "../repositories/garages.repository";

function toResponse(garage: Garage): GarageResponse {
  return {
    id: garage.id,
    userId: garage.userId,
    name: garage.name,
    isPrimary: garage.isPrimary,
    createdAt: garage.createdAt.toISOString(),
  };
}

export class GaragesService {
  async listMine(userId: string): Promise<GarageResponse[]> {
    const existing = await garagesRepository.listByUserId(userId);
    if (existing.length > 0) {
      return existing.map(toResponse);
    }
    const primary = await garagesRepository.createPrimary(userId);
    return [toResponse(primary)];
  }

  async ensurePrimary(userId: string): Promise<Garage> {
    const primary = await garagesRepository.findPrimaryByUserId(userId);
    if (primary) {
      return primary;
    }
    return garagesRepository.createPrimary(userId);
  }
}

export const garagesService = new GaragesService();
