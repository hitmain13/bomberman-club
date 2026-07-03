import type { TargetType } from "@prisma/client";

import { NotFoundError } from "@/common/errors";
import { carsRepository } from "@/modules/cars/repositories/cars.repository";
import { sightingsRepository } from "@/modules/sightings/repositories/sightings.repository";
import { usersRepository } from "@/modules/users/repositories/users.repository";

export async function resolveTargetOwnerId(
  targetType: TargetType,
  targetId: string,
): Promise<string> {
  if (targetType === "PROFILE") {
    const user = await usersRepository.findById(targetId);
    if (!user) {
      throw new NotFoundError("Profile", targetId);
    }
    return user.id;
  }
  if (targetType === "CAR") {
    const ownerId = await carsRepository.findOwnerId(targetId);
    if (!ownerId) {
      throw new NotFoundError("Car", targetId);
    }
    return ownerId;
  }
  const ownerId = await sightingsRepository.findOwnerId(targetId);
  if (!ownerId) {
    throw new NotFoundError("Sighting", targetId);
  }
  return ownerId;
}
