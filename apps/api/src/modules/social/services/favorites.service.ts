import type { LikeResponse } from "@bomberman/types";
import type { TargetType } from "@prisma/client";

import { favoritesRepository } from "../repositories/favorites.repository";

export class FavoritesService {
  async toggle(userId: string, targetType: TargetType, targetId: string): Promise<LikeResponse> {
    const existing = await favoritesRepository.find(userId, targetType, targetId);
    if (existing) {
      await favoritesRepository.remove(existing.id);
      const count = await favoritesRepository.count(targetType, targetId);
      return { liked: false, count };
    }
    await favoritesRepository.create(userId, targetType, targetId);
    const count = await favoritesRepository.count(targetType, targetId);
    return { liked: true, count };
  }
}

export const favoritesService = new FavoritesService();
