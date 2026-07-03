import { z } from "zod";

import { FuelSchema } from "../enums";

export const carInputSchema = z.object({
  garageId: z.string(),
  nickname: z.string().min(1).max(40),
  brand: z.string().min(1).max(40),
  model: z.string().min(1).max(60),
  generation: z.string().max(40).nullable().optional(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  fuel: FuelSchema,
  engine: z.string().min(1).max(40),
  weightKg: z.number().int().positive().max(5000),
  horsepowerHp: z.number().int().positive().max(3000),
  torqueNm: z.number().int().positive().max(3000),
  currentKm: z.number().int().nonnegative().max(2_000_000),
  plate: z
    .string()
    .max(10)
    .regex(/^[A-Z0-9-]+$/i)
    .nullable()
    .optional(),
  coverUploadId: z.string().nullable().optional(),
});

export const carResponseSchema = carInputSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  coverUrl: z.string().url().nullable(),
});

export type CarInput = z.infer<typeof carInputSchema>;
export type CarResponse = z.infer<typeof carResponseSchema>;
