import { sightingInputSchema } from "@bomberman/types";
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

export const newSightingSchema = sightingInputSchema
  .omit({ uploadId: true, occurredAt: true })
  .extend({
    uploadId: z.string().min(1, "Envie uma foto antes de publicar."),
    locationLabel: z.string().max(200).nullable().optional(),
    occurredAt: localDatetimeSchema,
  });

export type NewSightingValues = z.input<typeof newSightingSchema>;
export type NewSightingPayload = z.output<typeof newSightingSchema>;
