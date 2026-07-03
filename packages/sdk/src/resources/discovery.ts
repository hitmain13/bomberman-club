import {
  type CarsSort,
  type ExploreCarsResponse,
  type ExplorePeopleResponse,
  type FeedResponse,
  type FeedScope,
  type PeopleSort,
  type RankingMetric,
  type RankingResponse,
  type SearchResponse,
  type SearchType,
  exploreCarsResponseSchema,
  explorePeopleResponseSchema,
  feedResponseSchema,
  rankingResponseSchema,
  searchResponseSchema,
} from "@bomberman/types";

import type { HttpClient } from "../http";

export interface ExplorePeopleParams {
  q?: string | undefined;
  city?: string | undefined;
  since?: string | undefined;
  sort?: PeopleSort | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
}

export interface ExploreCarsParams {
  q?: string | undefined;
  stage?: string | undefined;
  owner?: string | undefined;
  sort?: CarsSort | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
}

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

  explorePeople(params: ExplorePeopleParams = {}): Promise<ExplorePeopleResponse> {
    return this.http.request({
      path: "/explore/people",
      query: { ...params },
      responseSchema: explorePeopleResponseSchema,
    });
  }

  exploreCars(params: ExploreCarsParams = {}): Promise<ExploreCarsResponse> {
    return this.http.request({
      path: "/explore/cars",
      query: { ...params },
      responseSchema: exploreCarsResponseSchema,
    });
  }
}
