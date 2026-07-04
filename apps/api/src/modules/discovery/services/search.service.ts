import type { SearchResponse, SearchType } from "@bomberman/types";

import { toCarResponse } from "@/modules/cars/mappers/cars.mapper";
import { toSightingResponse } from "@/modules/sightings/mappers/sightings.mapper";

import { discoveryRepository } from "../repositories/discovery.repository";

const LIMIT = 10;

async function searchPeople(query: string): Promise<SearchResponse["people"]> {
  if (query.length === 0) {
    return [];
  }
  const users = await discoveryRepository.searchPeople(query, LIMIT);
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
  const cars = await discoveryRepository.searchCars(query, LIMIT);
  return cars.map(toCarResponse);
}

async function searchSightings(query: string): Promise<SearchResponse["sightings"]> {
  if (query.length === 0) {
    return [];
  }
  const sightings = await discoveryRepository.searchSightings(query, LIMIT);
  return sightings.map((sighting) => toSightingResponse(sighting));
}

export class SearchService {
  async run(query: string, type: SearchType): Promise<SearchResponse> {
    const trimmed = query.trim();
    if (type === "PEOPLE") return { people: await searchPeople(trimmed), cars: [], sightings: [] };

    if (type === "CARS") return { people: [], cars: await searchCars(trimmed), sightings: [] };

    if (type === "SIGHTINGS") {
      return {
        people: [],
        cars: [],
        sightings: await searchSightings(trimmed),
      };
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
