import {
  type FeedResponse,
  type FeedScope,
  type RankingMetric,
  type RankingResponse,
  type SearchResponse,
  type SearchType,
  feedResponseSchema,
  rankingResponseSchema,
  searchResponseSchema,
} from "@bomberman/types";

import type { HttpClient } from "../http";

export class DiscoveryResource {
  constructor(private readonly http: HttpClient) {}

  feed(scope?: FeedScope): Promise<FeedResponse> {
    return this.http.request({
      path: "/feed",
      query: { scope },
      responseSchema: feedResponseSchema,
    });
  }

  ranking(metric?: RankingMetric): Promise<RankingResponse> {
    return this.http.request({
      path: "/ranking",
      query: { metric },
      responseSchema: rankingResponseSchema,
    });
  }

  search(q: string, type?: SearchType): Promise<SearchResponse> {
    return this.http.request({
      path: "/search",
      query: { q, type },
      responseSchema: searchResponseSchema,
    });
  }
}
