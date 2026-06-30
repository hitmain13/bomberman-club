import { z } from "zod";

export const mimeImageSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);

export const presignRequestSchema = z.object({
  mime: mimeImageSchema,
  size: z
    .number()
    .int()
    .positive()
    .max(15 * 1024 * 1024),
});

export const presignResponseSchema = z.object({
  uploadId: z.string(),
  bucketKey: z.string(),
  url: z.string().url(),
  headers: z.record(z.string()),
  expiresIn: z.number().int().positive(),
});

export const uploadResponseSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  mime: z.string(),
});

export type PresignRequest = z.infer<typeof presignRequestSchema>;
export type PresignResponse = z.infer<typeof presignResponseSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
