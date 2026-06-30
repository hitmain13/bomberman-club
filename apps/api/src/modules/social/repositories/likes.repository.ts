import type { Like, TargetType } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class LikesRepository {
  find(userId: string, targetType: TargetType, targetId: string): Promise<Like | null> {
    return prisma.like.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
  }

  create(userId: string, targetType: TargetType, targetId: string): Promise<Like> {
    return prisma.like.create({ data: { userId, targetType, targetId } });
  }

  remove(id: string): Promise<Like> {
    return prisma.like.delete({ where: { id } });
  }

  count(targetType: TargetType, targetId: string): Promise<number> {
    return prisma.like.count({ where: { targetType, targetId } });
  }
}

export const likesRepository = new LikesRepository();
