import type { Follow } from "@prisma/client";

import { prisma } from "@/database/prisma";

export class FollowsRepository {
  find(followerId: string, followingId: string): Promise<Follow | null> {
    return prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
  }

  create(followerId: string, followingId: string): Promise<Follow> {
    return prisma.follow.create({ data: { followerId, followingId } });
  }

  remove(id: string): Promise<Follow> {
    return prisma.follow.delete({ where: { id } });
  }

  countFollowers(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followingId: userId } });
  }
}

export const followsRepository = new FollowsRepository();
