import type { FeedItem, FeedScope } from "@bomberman/types";

import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";
import { toSightingResponse } from "@/modules/sightings/mappers/sightings.mapper";

import { discoveryRepository } from "../repositories/discovery.repository";

const FEED_LIMIT = 40;

function sortByDate(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    const aDate = a.kind === "SIGHTING" ? a.item.occurredAt : a.item.updatedAt;
    const bDate = b.kind === "SIGHTING" ? b.item.occurredAt : b.item.updatedAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

async function listRecentCars(): Promise<FeedItem[]> {
  const cars = await discoveryRepository.listRecentCars(FEED_LIMIT);
  return cars.map((car) => ({ kind: "CAR" as const, item: toCarResponse(car) }));
}

async function listRecentSightings(): Promise<FeedItem[]> {
  const sightings = await discoveryRepository.listRecentSightings(FEED_LIMIT);
  return sightings.map((sighting) => ({
    kind: "SIGHTING" as const,
    item: toSightingResponse(sighting),
  }));
}

async function listFollowingFeed(userId: string): Promise<FeedItem[]> {
  const followingIds = await discoveryRepository.listFollowingIds(userId);
  if (followingIds.length === 0) {
    return [];
  }
  const sightings = await discoveryRepository.listSightingsByAuthors(followingIds, FEED_LIMIT);
  return sightings.map((sighting) => ({
    kind: "SIGHTING" as const,
    item: toSightingResponse(sighting),
  }));
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
