import type { ExploreCar, ExploreCarOwner, ExplorePerson } from "@bomberman/types";

import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";

import type { CarWithOwner, UserWithFollowerCount } from "../repositories/discovery.repository";

export function toExplorePerson(
  user: UserWithFollowerCount,
  carsCount: number,
  isFollowedByMe: boolean,
): ExplorePerson {
  return {
    id: user.id,
    username: user.username,
    bio: user.bio,
    city: user.city,
    avatarUrl: user.avatar?.url ?? null,
    createdAt: user.createdAt.toISOString(),
    carsCount,
    followersCount: user._count.followers,
    isFollowedByMe,
  };
}

export function toExploreCar(car: CarWithOwner): ExploreCar {
  const owner: ExploreCarOwner = {
    id: car.garage.user.id,
    username: car.garage.user.username,
    avatarUrl: car.garage.user.avatar?.url ?? null,
  };
  return { car: toCarResponse(car), owner };
}
