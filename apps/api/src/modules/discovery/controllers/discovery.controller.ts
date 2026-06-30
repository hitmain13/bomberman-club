import { FeedScopeSchema, RankingMetricSchema, SearchTypeSchema } from "@bomberman/types";
import { Elysia } from "elysia";
import { z } from "zod";

import { parseOrThrow } from "@/common/validation";
import { authPlugin, requireAuth } from "@/plugins/auth.plugin";

import { feedService } from "../services/feed.service";
import { rankingService } from "../services/ranking.service";
import { searchService } from "../services/search.service";

const feedQuerySchema = z.object({ scope: FeedScopeSchema.optional() });
const rankingQuerySchema = z.object({ metric: RankingMetricSchema.optional() });
const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: SearchTypeSchema.optional(),
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
  });
