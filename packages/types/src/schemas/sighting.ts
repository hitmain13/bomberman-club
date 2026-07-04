import { z } from "zod";

import { SightingPeriodSchema } from "../enums";

export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);

export const sightingInputSchema = z.object({
  uploadId: z.string(),
  title: z.string().min(3).max(80),
  description: z.string().max(500).nullable().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  locationLabel: z.string().max(200).nullable().optional(),
  occurredAt: z.string().datetime(),
});

export const sightingAuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().nullable(),
});

export const sightingResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  author: sightingAuthorSchema,
  uploadId: z.string(),
  imageUrl: z.string().url(),
  title: z.string(),
  description: z.string().nullable(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  locationLabel: z.string().nullable(),
  occurredAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const sightingListQuerySchema = z.object({
  period: SightingPeriodSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SightingInput = z.infer<typeof sightingInputSchema>;
export type SightingResponse = z.infer<typeof sightingResponseSchema>;
export type SightingAuthor = z.infer<typeof sightingAuthorSchema>;
export type SightingListQuery = z.infer<typeof sightingListQuerySchema>;
