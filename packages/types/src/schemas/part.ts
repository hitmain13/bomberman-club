import { z } from "zod";

export const partCategorySchema = z.object({
  id: z.string(),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-z0-9_-]*$/),
  name: z.string().min(1).max(60),
});

export const partSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  manufacturer: z.string().min(1).max(60),
  name: z.string().min(1).max(80),
});

export const carPartInputSchema = z
  .object({
    partId: z.string().optional(),
    categoryId: z.string().optional(),
    manufacturer: z.string().trim().min(1).max(60).optional(),
    name: z.string().trim().min(1).max(80).optional(),
    installedAt: z.string().datetime().nullable().optional(),
    description: z.string().max(280).nullable().optional(),
  })
  .refine(
    (data) => Boolean(data.partId) || Boolean(data.categoryId && data.manufacturer && data.name),
    {
      message: "Selecione uma peça existente ou informe fabricante e nome para cadastrar uma nova.",
    },
  );

export const carPartResponseSchema = z.object({
  id: z.string(),
  part: partSchema,
  category: partCategorySchema,
  installedAt: z.string().datetime().nullable(),
  description: z.string().nullable(),
});

export type PartCategory = z.infer<typeof partCategorySchema>;
export type Part = z.infer<typeof partSchema>;
export type CarPartInput = z.infer<typeof carPartInputSchema>;
export type CarPartResponse = z.infer<typeof carPartResponseSchema>;
