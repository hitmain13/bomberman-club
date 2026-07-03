import { z } from "zod";

export const CarsSortSchema = z.enum(["NEWEST", "MOST_POWERFUL", "LIGHTEST"]);
export type CarsSort = z.infer<typeof CarsSortSchema>;
