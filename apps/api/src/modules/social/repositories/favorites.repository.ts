import type { Favorite, TargetType } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class FavoritesRepository {
  find(userId: string, targetType: TargetType, targetId: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
  }

  create(userId: string, targetType: TargetType, targetId: string): Promise<Favorite> {
    return prisma.favorite.create({ data: { userId, targetType, targetId } });
  }

  remove(id: string): Promise<Favorite> {
    return prisma.favorite.delete({ where: { id } });
  }

  count(targetType: TargetType, targetId: string): Promise<number> {
    return prisma.favorite.count({ where: { targetType, targetId } });
  }
}

export const favoritesRepository = new FavoritesRepository();
