import type { TargetType } from "@prisma/client";

import { NotFoundError } from "@/common/errors";
import { prisma } from "@/database/prisma";

export async function resolveTargetOwnerId(
  targetType: TargetType,
  targetId: string,
): Promise<string> {
  if (targetType === "PROFILE") {
    const user = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!user) {
      throw new NotFoundError("Profile", targetId);
    }
    return user.id;
  }
  if (targetType === "CAR") {
    const car = await prisma.car.findUnique({
      where: { id: targetId },
      select: { garage: { select: { userId: true } } },
    });
    if (!car) {
      throw new NotFoundError("Car", targetId);
    }
    return car.garage.userId;
  }
  const sighting = await prisma.sighting.findUnique({
    where: { id: targetId },
    select: { userId: true },
  });
  if (!sighting) {
    throw new NotFoundError("Sighting", targetId);
  }
  return sighting.userId;
}
