import type { FeedItem, FeedScope } from "@bomberman/types";

import { prisma } from "@/database/prisma";
import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";
import { toSightingResponse } from "@/modules/sightings/mappers/sightings.mapper";

const FEED_LIMIT = 40;

async function listRecentCars(): Promise<FeedItem[]> {
  const cars = await prisma.car.findMany({
    take: FEED_LIMIT,
    orderBy: { updatedAt: "desc" },
    include: { cover: { select: { url: true } } },
  });
  return cars.map((car) => ({ kind: "CAR" as const, item: toCarResponse(car) }));
}

async function listRecentSightings(): Promise<FeedItem[]> {
  const sightings = await prisma.sighting.findMany({
    take: FEED_LIMIT,
    orderBy: { occurredAt: "desc" },
    include: { upload: true, user: { include: { avatar: true } } },
  });
  return sightings.map((sighting) => ({
    kind: "SIGHTING" as const,
    item: toSightingResponse(sighting),
  }));
}

async function listFollowingFeed(userId: string): Promise<FeedItem[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = follows.map((follow) => follow.followingId);
  if (followingIds.length === 0) {
    return [];
  }
  const sightings = await prisma.sighting.findMany({
    where: { userId: { in: followingIds } },
    take: FEED_LIMIT,
    orderBy: { occurredAt: "desc" },
    include: { upload: true, user: { include: { avatar: true } } },
  });
  return sightings.map((sighting) => ({
    kind: "SIGHTING" as const,
    item: toSightingResponse(sighting),
  }));
}

function sortByDate(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    const aDate = a.kind === "SIGHTING" ? a.item.occurredAt : a.item.updatedAt;
    const bDate = b.kind === "SIGHTING" ? b.item.occurredAt : b.item.updatedAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

export class FeedService {
  async list(userId: string, scope: FeedScope): Promise<{ items: FeedItem[] }> {
    if (scope === "FOLLOWING") {
      const items = await listFollowingFeed(userId);
      return { items: sortByDate(items).slice(0, FEED_LIMIT) };
    }
    const [cars, sightings] = await Promise.all([listRecentCars(), listRecentSightings()]);
    const merged = sortByDate([...cars, ...sightings]).slice(0, FEED_LIMIT);
    return { items: merged };
  }
}

export const feedService = new FeedService();
