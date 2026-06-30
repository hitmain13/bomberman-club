import { z } from "zod";

export const TargetTypeSchema = z.enum(["PROFILE", "CAR", "SIGHTING"]);
export type TargetType = z.infer<typeof TargetTypeSchema>;
