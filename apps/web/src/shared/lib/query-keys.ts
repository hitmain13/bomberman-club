import type {
  CarsSort,
  FeedScope,
  PeopleSort,
  RankingMetric,
  SearchType,
  SightingPeriod,
} from "@bomberman/types";

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  users: {
    byUsername: (username: string) => ["users", "byUsername", username] as const,
    stats: (username: string) => ["users", "stats", username] as const,
    likes: (username: string) => ["users", "likes", username] as const,
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
    byUser: (username: string) => ["sightings", "byUser", username] as const,
  },
  social: {
    likes: (targetType: string, targetId: string) =>
      ["social", "likes", targetType, targetId] as const,
    comments: (targetType: string, targetId: string) =>
      ["social", "comments", targetType, targetId] as const,
    follow: (username: string) => ["social", "follow", username] as const,
    notifications: () => ["social", "notifications"] as const,
  },
  geo: {
    search: (q: string) => ["geo", "search", q] as const,
  },
  discovery: {
    feed: (scope: FeedScope) => ["discovery", "feed", scope] as const,
    ranking: (metric: RankingMetric) => ["discovery", "ranking", metric] as const,
    search: (q: string, type: SearchType) => ["discovery", "search", q, type] as const,
    explorePeople: (filters: {
      q: string;
      city: string;
      since: string;
      sort: PeopleSort;
    }) => ["discovery", "explore-people", filters] as const,
    exploreCars: (filters: {
      q: string;
      stage: string;
      owner: string;
      sort: CarsSort;
    }) => ["discovery", "explore-cars", filters] as const,
  },
} as const;
