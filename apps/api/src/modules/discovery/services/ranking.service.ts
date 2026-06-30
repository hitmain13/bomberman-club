import type { RankingItem, RankingMetric } from "@bomberman/types";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";
import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";

const TOP_N = 20;

function orderBy(metric: RankingMetric): Prisma.CarOrderByWithRelationInput[] {
  if (metric === "POWER") {
    return [{ horsepowerHp: "desc" }];
  }
  if (metric === "TORQUE") {
    return [{ torqueNm: "desc" }];
  }
  if (metric === "WEIGHT_TO_POWER") {
    return [{ weightKg: "asc" }, { horsepowerHp: "desc" }];
  }
  return [{ horsepowerHp: "desc" }, { weightKg: "asc" }];
}

function computeMetric(
  metric: RankingMetric,
  car: { weightKg: number; horsepowerHp: number; torqueNm: number },
): number {
  if (metric === "POWER") {
    return car.horsepowerHp;
  }
  if (metric === "TORQUE") {
    return car.torqueNm;
  }
  if (metric === "WEIGHT_TO_POWER") {
    return car.horsepowerHp === 0 ? 0 : Math.round((car.weightKg / car.horsepowerHp) * 100) / 100;
  }
  return car.weightKg === 0 ? 0 : Math.round((car.horsepowerHp / (car.weightKg / 1000)) * 10) / 10;
}

export class RankingService {
  async top(metric: RankingMetric): Promise<{ items: RankingItem[] }> {
    const cars = await prisma.car.findMany({
      take: TOP_N,
      orderBy: orderBy(metric),
      include: {
        cover: { select: { url: true } },
        garage: { include: { user: { include: { avatar: true } } } },
      },
    });
    const items: RankingItem[] = cars.map((car) => ({
      car: toCarResponse(car),
      owner: {
        id: car.garage.user.id,
        username: car.garage.user.username,
        bio: car.garage.user.bio,
        city: car.garage.user.city,
        avatarUrl: car.garage.user.avatar?.url ?? null,
        createdAt: car.garage.user.createdAt.toISOString(),
      },
      metric: computeMetric(metric, car),
    }));
    return { items };
  }
}

export const rankingService = new RankingService();
