import type { LikeResponse } from "@bomberman/types";
import type { TargetType } from "@prisma/client";

import { likesRepository } from "../repositories/likes.repository";
import { notificationsRepository } from "../repositories/notifications.repository";
import { resolveTargetOwnerId } from "./target-owner.service";

export class LikesService {
  async toggle(userId: string, targetType: TargetType, targetId: string): Promise<LikeResponse> {
    const existing = await likesRepository.find(userId, targetType, targetId);
    if (existing) {
      await likesRepository.remove(existing.id);
      const count = await likesRepository.count(targetType, targetId);
      return { liked: false, count };
    }
    await likesRepository.create(userId, targetType, targetId);
    const ownerId = await resolveTargetOwnerId(targetType, targetId);
    if (ownerId !== userId) {
      await notificationsRepository.create({
        userId: ownerId,
        type: "LIKE",
        actorId: userId,
        targetType,
        targetId,
      });
    }
    const count = await likesRepository.count(targetType, targetId);
    return { liked: true, count };
  }
}

export const likesService = new LikesService();
