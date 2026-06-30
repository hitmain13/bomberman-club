import { z } from "zod";

import { TargetTypeSchema } from "../enums";

export const targetRefSchema = z.object({
  targetType: TargetTypeSchema,
  targetId: z.string(),
});

export const commentInputSchema = targetRefSchema.extend({
  content: z.string().min(1).max(500),
});

export const commentResponseSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  authorUsername: z.string(),
  authorAvatarUrl: z.string().url().nullable(),
  content: z.string(),
  createdAt: z.string().datetime(),
});

export const likeResponseSchema = z.object({
  liked: z.boolean(),
  count: z.number().int().nonnegative(),
});

export const followResponseSchema = z.object({
  following: z.boolean(),
  followersCount: z.number().int().nonnegative(),
});

export type TargetRef = z.infer<typeof targetRefSchema>;
export type CommentInput = z.infer<typeof commentInputSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type LikeResponse = z.infer<typeof likeResponseSchema>;
export type FollowResponse = z.infer<typeof followResponseSchema>;
