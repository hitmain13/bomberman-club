import { z } from "zod";

export const FeedScopeSchema = z.enum(["FORYOU", "FOLLOWING", "RECENT"]);
export type FeedScope = z.infer<typeof FeedScopeSchema>;

export const RankingMetricSchema = z.enum([
  "POWER",
  "WEIGHT_TO_POWER",
  "TORQUE",
  "POWER_TO_WEIGHT",
]);
export type RankingMetric = z.infer<typeof RankingMetricSchema>;

export const SearchTypeSchema = z.enum(["ALL", "PEOPLE", "CARS", "SIGHTINGS"]);
export type SearchType = z.infer<typeof SearchTypeSchema>;
