import { z } from "zod";

export const FuelSchema = z.enum([
  "GASOLINE",
  "ETHANOL",
  "FLEX",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "OTHER",
]);
export type Fuel = z.infer<typeof FuelSchema>;
