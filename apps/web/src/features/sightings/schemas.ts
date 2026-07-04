import { latitudeSchema, longitudeSchema } from "@bomberman/types";
import { z } from "zod";

const localDatetimeSchema = z
  .string()
  .min(1, "Informe a data e hora.")
  .transform((value, ctx) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Data e hora inválidas." });
      return z.NEVER;
    }
    return parsed.toISOString();
  });

export const newSightingSchema = z.object({
  uploadIds: z.array(z.string()).min(1, "Envie ao menos uma foto.").max(10),
  title: z.string().min(3).max(80),
  description: z.string().max(500).nullable().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  occurredAt: localDatetimeSchema,
});

export type NewSightingValues = z.input<typeof newSightingSchema>;
export type NewSightingPayload = z.output<typeof newSightingSchema>;
