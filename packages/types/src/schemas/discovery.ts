import { z } from "zod";

import { carResponseSchema } from "./car";
import { paginatedResponseSchema } from "./common";
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

// ── Explore: Pessoas ─────────────────────────────────────────────────────────

export const explorePersonSchema = publicUserSchema.extend({
  carsCount: z.number().int().nonnegative(),
  followersCount: z.number().int().nonnegative(),
  isFollowedByMe: z.boolean(),
});

export const explorePeopleResponseSchema = paginatedResponseSchema(explorePersonSchema);

// ── Explore: Carros ──────────────────────────────────────────────────────────

export const exploreCarOwnerSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().nullable(),
});

export const exploreCarSchema = z.object({
  car: carResponseSchema,
  owner: exploreCarOwnerSchema,
});

export const exploreCarsResponseSchema = paginatedResponseSchema(exploreCarSchema);

// ── Perfil: estatísticas agregadas ───────────────────────────────────────────

export const profileStatsSchema = z.object({
  carsCount: z.number().int().nonnegative(),
  sightingsCount: z.number().int().nonnegative(),
  followersCount: z.number().int().nonnegative(),
  followingCount: z.number().int().nonnegative(),
  likesReceivedCount: z.number().int().nonnegative(),
  isFollowedByMe: z.boolean(),
});

export const likedItemsResponseSchema = z.object({
  items: z.array(feedItemSchema),
});

export type FeedItem = z.infer<typeof feedItemSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type RankingItem = z.infer<typeof rankingItemSchema>;
export type RankingResponse = z.infer<typeof rankingResponseSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type ExplorePerson = z.infer<typeof explorePersonSchema>;
export type ExplorePeopleResponse = z.infer<typeof explorePeopleResponseSchema>;
export type ExploreCarOwner = z.infer<typeof exploreCarOwnerSchema>;
export type ExploreCar = z.infer<typeof exploreCarSchema>;
export type ExploreCarsResponse = z.infer<typeof exploreCarsResponseSchema>;
export type ProfileStats = z.infer<typeof profileStatsSchema>;
export type LikedItemsResponse = z.infer<typeof likedItemsResponseSchema>;
