import { FuelSchema, carInputSchema } from "@bomberman/types";
import type { z } from "zod";

export const carFormSchema = carInputSchema;
export type CarFormValues = z.infer<typeof carFormSchema>;

export { FuelSchema };
