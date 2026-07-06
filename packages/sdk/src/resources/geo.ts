import {
  type GeoReverseResponse,
  type GeoSearchResponse,
  geoReverseResponseSchema,
  geoSearchResponseSchema,
} from "@bomberman/types";

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

  reverse(lat: number, lng: number): Promise<GeoReverseResponse> {
    return this.http.request({
      path: "/geo/reverse",
      query: { lat, lng },
      responseSchema: geoReverseResponseSchema,
    });
  }
}
