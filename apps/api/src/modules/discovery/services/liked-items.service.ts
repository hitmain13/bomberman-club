import type { FeedItem } from "@bomberman/types";

import { NotFoundError } from "@/common/errors";
import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";
import { carsRepository } from "@/modules/cars/repositories/cars.repository";
import { toSightingResponse } from "@/modules/sightings/mappers/sightings.mapper";
import { sightingsRepository } from "@/modules/sightings/repositories/sightings.repository";
import { likesRepository } from "@/modules/social/repositories/likes.repository";
import { usersRepository } from "@/modules/users/repositories/users.repository";

const LIMIT = 40;

export class LikedItemsService {
  async listByUsername(username: string): Promise<{ items: FeedItem[] }> {
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError("User", username);
    }

    const likes = await likesRepository.listTargetsByUser(user.id, LIMIT);
    const carIds = likes.filter((like) => like.targetType === "CAR").map((like) => like.targetId);
    const sightingIds = likes
      .filter((like) => like.targetType === "SIGHTING")
      .map((like) => like.targetId);

    const [cars, sightings] = await Promise.all([
      carsRepository.findManyByIds(carIds),
      sightingsRepository.findManyByIds(sightingIds),
    ]);
    const carById = new Map(cars.map((car) => [car.id, car]));
    const sightingById = new Map(sightings.map((sighting) => [sighting.id, sighting]));

    const items: FeedItem[] = [];
    for (const like of likes) {
      if (like.targetType === "CAR") {
        const car = carById.get(like.targetId);
        if (car) {
          items.push({ kind: "CAR", item: toCarResponse(car) });
        }
        continue;
      }
      if (like.targetType === "SIGHTING") {
        const sighting = sightingById.get(like.targetId);
        if (sighting) {
          items.push({ kind: "SIGHTING", item: toSightingResponse(sighting) });
        }
      }
    }
    return { items };
  }
}

export const likedItemsService = new LikedItemsService();
