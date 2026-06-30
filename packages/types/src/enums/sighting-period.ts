import { z } from "zod";

export const SightingPeriodSchema = z.enum(["TODAY", "WEEK", "MONTH", "YEAR", "ALL"]);
export type SightingPeriod = z.infer<typeof SightingPeriodSchema>;
