import { z } from "zod";

import { carResponseSchema } from "./car";
import { sightingResponseSchema } from "./sighting";
import { publicUserSchema } from "./user";

export const feedItemSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("CAR"), item: carResponseSchema }),
  z.object({ kind: z.literal("SIGHTING"), item: sightingResponseSchema }),
]);

export const feedResponseSchema = z.object({
  items: z.array(feedItemSchema),
});

export const rankingItemSchema = z.object({
  car: carResponseSchema,
  owner: publicUserSchema,
  metric: z.number(),
});

export const rankingResponseSchema = z.object({
  items: z.array(rankingItemSchema),
});

export const searchResponseSchema = z.object({
  people: z.array(publicUserSchema),
  cars: z.array(carResponseSchema),
  sightings: z.array(sightingResponseSchema),
});

export type FeedItem = z.infer<typeof feedItemSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type RankingItem = z.infer<typeof rankingItemSchema>;
export type RankingResponse = z.infer<typeof rankingResponseSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
