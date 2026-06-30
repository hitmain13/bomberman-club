import { z } from "zod";

export const SpecValueTypeSchema = z.enum(["STRING", "NUMBER", "BOOLEAN", "ENUM"]);
export type SpecValueType = z.infer<typeof SpecValueTypeSchema>;
