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

  countForTargets(
    refs: ReadonlyArray<{ targetType: TargetType; targetId: string }>,
  ): Promise<number> {
    if (refs.length === 0) {
      return Promise.resolve(0);
    }
    return prisma.like.count({
      where: { OR: refs.map((ref) => ({ targetType: ref.targetType, targetId: ref.targetId })) },
    });
  }

  listTargetsByUser(
    userId: string,
    limit: number,
  ): Promise<Array<{ targetType: TargetType; targetId: string; createdAt: Date }>> {
    return prisma.like.findMany({
      where: { userId },
      select: { targetType: true, targetId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const likesRepository = new LikesRepository();
