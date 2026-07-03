import type { ProfileStats } from "@bomberman/types";

import { NotFoundError } from "@/common/errors";
import { carsRepository } from "@/modules/cars/repositories/cars.repository";
import { sightingsRepository } from "@/modules/sightings/repositories/sightings.repository";
import { followsRepository } from "@/modules/social/repositories/follows.repository";
import { likesRepository } from "@/modules/social/repositories/likes.repository";
import { usersRepository } from "@/modules/users/repositories/users.repository";

export class ProfileStatsService {
  async get(username: string, viewerId: string | null): Promise<ProfileStats> {
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError("User", username);
    }

    const [carIds, sightingIds, followersCount, followingCount, profileLikes] = await Promise.all([
      carsRepository.listIdsByOwnerUsername(username),
      sightingsRepository.listIdsByUsername(username),
      followsRepository.countFollowers(user.id),
      followsRepository.countFollowing(user.id),
      likesRepository.count("PROFILE", user.id),
    ]);

    const contentLikes = await likesRepository.countForTargets([
      ...carIds.map((id) => ({ targetType: "CAR" as const, targetId: id })),
      ...sightingIds.map((id) => ({ targetType: "SIGHTING" as const, targetId: id })),
    ]);

    const isFollowedByMe =
      viewerId !== null && viewerId !== user.id
        ? Boolean(await followsRepository.find(viewerId, user.id))
        : false;

    return {
      carsCount: carIds.length,
      sightingsCount: sightingIds.length,
      followersCount,
      followingCount,
      likesReceivedCount: profileLikes + contentLikes,
      isFollowedByMe,
    };
  }
}

export const profileStatsService = new ProfileStatsService();
