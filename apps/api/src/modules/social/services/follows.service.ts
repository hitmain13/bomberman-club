import type { FollowResponse } from "@bomberman/types";

import { ConflictError, NotFoundError } from "@/common/errors";
import { usersRepository } from "@/modules/users/repositories/users.repository";

import { followsRepository } from "../repositories/follows.repository";
import { notificationsRepository } from "../repositories/notifications.repository";

async function findUserIdByUsername(username: string): Promise<string> {
  const user = await usersRepository.findByUsername(username);
  if (!user) {
    throw new NotFoundError("User", username);
  }
  return user.id;
}

export class FollowsService {
  async toggle(followerId: string, username: string): Promise<FollowResponse> {
    const followingId = await findUserIdByUsername(username);
    if (followingId === followerId) {
      throw new ConflictError("Você não pode seguir a si mesmo.");
    }
    const existing = await followsRepository.find(followerId, followingId);
    if (existing) {
      await followsRepository.remove(existing.id);
      const followersCount = await followsRepository.countFollowers(followingId);
      return { following: false, followersCount };
    }
    await followsRepository.create(followerId, followingId);
    await notificationsRepository.create({
      userId: followingId,
      type: "FOLLOW",
      actorId: followerId,
      targetType: "PROFILE",
      targetId: followingId,
    });
    const followersCount = await followsRepository.countFollowers(followingId);
    return { following: true, followersCount };
  }
}

export const followsService = new FollowsService();
