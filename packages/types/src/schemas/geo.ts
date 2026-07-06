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

export const geoReverseQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const geoReverseResponseSchema = z.object({
  label: z.string().nullable(),
});

export type GeoSearchResult = z.infer<typeof geoSearchResultSchema>;
export type GeoSearchResponse = z.infer<typeof geoSearchResponseSchema>;
export type GeoReverseQuery = z.infer<typeof geoReverseQuerySchema>;
export type GeoReverseResponse = z.infer<typeof geoReverseResponseSchema>;
