import type { SearchResponse, SearchType } from "@bomberman/types";

import { prisma } from "@/database/prisma";
import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";
import { toSightingResponse } from "@/modules/sightings/mappers/sightings.mapper";

const LIMIT = 10;

async function searchPeople(query: string): Promise<SearchResponse["people"]> {
  if (query.length === 0) {
    return [];
  }
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
      ],
    },
    take: LIMIT,
    include: { avatar: true },
  });
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    bio: user.bio,
    city: user.city,
    avatarUrl: user.avatar?.url ?? null,
    createdAt: user.createdAt.toISOString(),
  }));
}

async function searchCars(query: string): Promise<SearchResponse["cars"]> {
  if (query.length === 0) {
    return [];
  }
  const cars = await prisma.car.findMany({
    where: {
      OR: [
        { nickname: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
      ],
    },
    take: LIMIT,
    include: { cover: { select: { url: true } } },
  });
  return cars.map(toCarResponse);
}

async function searchSightings(query: string): Promise<SearchResponse["sightings"]> {
  if (query.length === 0) {
    return [];
  }
  const sightings = await prisma.sighting.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    take: LIMIT,
    include: { upload: true, user: { include: { avatar: true } } },
  });
  return sightings.map(toSightingResponse);
}

export class SearchService {
  async run(query: string, type: SearchType): Promise<SearchResponse> {
    const trimmed = query.trim();
    if (type === "PEOPLE") {
      return { people: await searchPeople(trimmed), cars: [], sightings: [] };
    }
    if (type === "CARS") {
      return { people: [], cars: await searchCars(trimmed), sightings: [] };
    }
    if (type === "SIGHTINGS") {
      return { people: [], cars: [], sightings: await searchSightings(trimmed) };
    }
    const [people, cars, sightings] = await Promise.all([
      searchPeople(trimmed),
      searchCars(trimmed),
      searchSightings(trimmed),
    ]);
    return { people, cars, sightings };
  }
}

export const searchService = new SearchService();
