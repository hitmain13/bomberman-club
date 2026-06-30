import { z } from "zod";

export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);

export const sightingInputSchema = z.object({
  uploadId: z.string(),
  title: z.string().min(3).max(80),
  description: z.string().max(500).nullable().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  occurredAt: z.string().datetime(),
});

export const sightingResponseSchema = sightingInputSchema.extend({
  id: z.string(),
  userId: z.string(),
  imageUrl: z.string().url(),
  createdAt: z.string().datetime(),
});

export type SightingInput = z.infer<typeof sightingInputSchema>;
export type SightingResponse = z.infer<typeof sightingResponseSchema>;
