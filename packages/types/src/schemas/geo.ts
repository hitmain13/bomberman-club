import { z } from "zod";

export const geoSearchResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const geoSearchResponseSchema = z.object({
  results: z.array(geoSearchResultSchema),
});

export type GeoSearchResult = z.infer<typeof geoSearchResultSchema>;
export type GeoSearchResponse = z.infer<typeof geoSearchResponseSchema>;
