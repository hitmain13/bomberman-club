import { sightingInputSchema } from "@bomberman/types";
import { z } from "zod";

export const newSightingSchema = sightingInputSchema.omit({ uploadId: true }).extend({
  uploadId: z.string().min(1, "Envie uma foto antes de publicar."),
});

export type NewSightingValues = z.infer<typeof newSightingSchema>;
