import type { SightingPeriod } from "@bomberman/types";

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  users: {
    byUsername: (username: string) => ["users", "byUsername", username] as const,
  },
  garages: {
    mine: () => ["garages", "mine"] as const,
    byUser: (username: string) => ["garages", "byUser", username] as const,
  },
  cars: {
    mine: () => ["cars", "mine"] as const,
    byUser: (username: string) => ["cars", "byUser", username] as const,
    detail: (id: string) => ["cars", "detail", id] as const,
    parts: (id: string) => ["cars", "parts", id] as const,
    specs: (id: string) => ["cars", "specs", id] as const,
  },
  catalog: {
    partCategories: () => ["catalog", "part-categories"] as const,
    partsByCategory: (categoryId: string) => ["catalog", "parts", categoryId] as const,
    specDefinitions: () => ["catalog", "spec-definitions"] as const,
  },
  sightings: {
    list: (period: SightingPeriod) => ["sightings", "list", period] as const,
    detail: (id: string) => ["sightings", "detail", id] as const,
  },
} as const;
