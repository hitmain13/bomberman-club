import { type GeoSearchResponse, geoSearchResponseSchema } from "@bomberman/types";

import type { HttpClient } from "../http";

export class GeoResource {
  constructor(private readonly http: HttpClient) {}

  search(q: string): Promise<GeoSearchResponse> {
    return this.http.request({
      path: "/geo/search",
      query: { q },
      responseSchema: geoSearchResponseSchema,
    });
  }
}
