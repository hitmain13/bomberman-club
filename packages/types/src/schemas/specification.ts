import { z } from "zod";

import { SpecValueTypeSchema } from "../enums";

export const specDefinitionSchema = z.object({
  id: z.string(),
  key: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-z0-9_]*$/),
  name: z.string().min(1).max(60),
  type: SpecValueTypeSchema,
  unit: z.string().max(16).nullable(),
  category: z.string().max(40).nullable(),
  enumOptions: z.array(z.string()).nullable(),
});

export const specValueInputSchema = z.object({
  definitionId: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const specValueResponseSchema = z.object({
  id: z.string(),
  definition: specDefinitionSchema,
  valueString: z.string().nullable(),
  valueNumber: z.number().nullable(),
  valueBoolean: z.boolean().nullable(),
});

export type SpecDefinition = z.infer<typeof specDefinitionSchema>;
export type SpecValueInput = z.infer<typeof specValueInputSchema>;
export type SpecValueResponse = z.infer<typeof specValueResponseSchema>;
