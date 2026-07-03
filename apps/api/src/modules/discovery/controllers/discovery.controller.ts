import {
  CarsSortSchema,
  FeedScopeSchema,
  PeopleSortSchema,
  RankingMetricSchema,
  SearchTypeSchema,
} from "@bomberman/types";
import { Elysia } from "elysia";
import { z } from "zod";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { exploreCarsService } from "../services/explore-cars.service";
import { explorePeopleService } from "../services/explore-people.service";
import { feedService } from "../services/feed.service";
import { rankingService } from "../services/ranking.service";
import { searchService } from "../services/search.service";

const feedQuerySchema = z.object({ scope: FeedScopeSchema.optional() });
const rankingQuerySchema = z.object({ metric: RankingMetricSchema.optional() });
const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: SearchTypeSchema.optional(),
});
const explorePeopleQuerySchema = z.object({
  q: z.string().max(100).optional(),
  city: z.string().max(80).optional(),
  since: z.string().datetime().optional(),
  sort: PeopleSortSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
const exploreCarsQuerySchema = z.object({
  q: z.string().max(100).optional(),
  stage: z.string().max(40).optional(),
  owner: z.string().max(24).optional(),
  sort: CarsSortSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const discoveryController = new Elysia({ name: "discovery-controller" })
  .use(authPlugin)
  .get("/feed", ({ currentUser, query }) => {
    const user = requireAuth(currentUser);
    const params = parseOrThrow(feedQuerySchema, query);
    return feedService.list(user.id, params.scope ?? "RECENT");
  })
  .get("/ranking", ({ query }) => {
    const params = parseOrThrow(rankingQuerySchema, query);
    return rankingService.top(params.metric ?? "POWER");
  })
  .get("/search", ({ query }) => {
    const params = parseOrThrow(searchQuerySchema, query);
    return searchService.run(params.q, params.type ?? "ALL");
  })
  .get("/explore/people", ({ currentUser, query }) => {
    const user = requireAuth(currentUser);
    const params = parseOrThrow(explorePeopleQuerySchema, query);
    return explorePeopleService.list({
      viewerId: user.id,
      query: params.q ?? null,
      city: params.city ?? null,
      since: params.since ? new Date(params.since) : null,
      sort: params.sort ?? "RECENT",
      cursor: params.cursor ?? null,
      limit: params.limit,
    });
  })
  .get("/explore/cars", ({ query }) => {
    const params = parseOrThrow(exploreCarsQuerySchema, query);
    return exploreCarsService.list({
      query: params.q ?? null,
      stage: params.stage ?? null,
      ownerUsername: params.owner ?? null,
      sort: params.sort ?? "NEWEST",
      cursor: params.cursor ?? null,
      limit: params.limit,
    });
  });
