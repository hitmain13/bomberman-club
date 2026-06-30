import type { ZodSchema, ZodTypeDef } from "zod";

import { ValidationError } from "./errors";

export function parseOrThrow<TInput, TOutput>(
  schema: ZodSchema<TOutput, ZodTypeDef, TInput>,
  data: unknown,
): TOutput {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "_";
      details[path] = issue.message;
    }
    throw new ValidationError("Invalid request payload", details);
  }
  return result.data;
}
