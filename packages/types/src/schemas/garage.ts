import { z } from "zod";

export const garageInputSchema = z.object({
  name: z.string().min(1).max(40),
  isPrimary: z.boolean().optional(),
});

export const garageResponseSchema = garageInputSchema.extend({
  id: z.string(),
  userId: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime(),
});

export type GarageInput = z.infer<typeof garageInputSchema>;
export type GarageResponse = z.infer<typeof garageResponseSchema>;
