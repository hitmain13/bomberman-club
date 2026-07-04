import { z } from "zod";

import { SightingPeriodSchema } from "../enums";

export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);

export const sightingImageSchema = z.object({
  uploadId: z.string(),
  url: z.string().url(),
  position: z.number().int().nonnegative(),
});

export const sightingStatsSchema = z.object({
  likeCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  liked: z.boolean(),
});

export const sightingAuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().nullable(),
});

export function resolveUploadIds(input: {
  uploadId?: string | undefined;
  uploadIds?: string[] | undefined;
}): string[] {
  if (input.uploadIds && input.uploadIds.length > 0) {
    return input.uploadIds;
  }
  if (input.uploadId) {
    return [input.uploadId];
  }
  return [];
}

export const sightingInputSchema = z
  .object({
    uploadId: z.string().optional(),
    uploadIds: z.array(z.string()).min(1).max(10).optional(),
    title: z.string().min(3).max(80),
    description: z.string().max(500).nullable().optional(),
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    street: z.string().max(200).nullable().optional(),
    /** @deprecated Prefer `street`; kept for backward compatibility with older clients. */
    locationLabel: z.string().max(200).nullable().optional(),
    occurredAt: z.string().datetime(),
  })
  .superRefine((value, ctx) => {
    const ids = resolveUploadIds(value);
    if (ids.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe ao menos uma foto.",
        path: ["uploadIds"],
      });
    }
  });

export const sightingUpdateSchema = z.object({
  title: z.string().min(3).max(80).optional(),
  description: z.string().max(500).nullable().optional(),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  street: z.string().max(200).nullable().optional(),
  uploadIds: z.array(z.string()).min(1).max(10).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const sightingResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  author: sightingAuthorSchema,
  uploadId: z.string(),
  imageUrl: z.string().url(),
  images: z.array(sightingImageSchema),
  title: z.string(),
  description: z.string().nullable(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  street: z.string().nullable(),
  locationLabel: z.string().nullable(),
  occurredAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  stats: sightingStatsSchema,
});

export const sightingListQuerySchema = z.object({
  period: SightingPeriodSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SightingImage = z.infer<typeof sightingImageSchema>;
export type SightingStats = z.infer<typeof sightingStatsSchema>;
export type SightingInput = z.infer<typeof sightingInputSchema>;
export type SightingUpdateInput = z.infer<typeof sightingUpdateSchema>;
export type SightingResponse = z.infer<typeof sightingResponseSchema>;
export type SightingAuthor = z.infer<typeof sightingAuthorSchema>;
export type SightingListQuery = z.infer<typeof sightingListQuerySchema>;
