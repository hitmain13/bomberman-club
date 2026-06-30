import { z } from "zod";

export const idSchema = z.string().min(1);
export const isoDateSchema = z.string().datetime();
export const paginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

export type Pagination = z.infer<typeof paginationQuerySchema>;
