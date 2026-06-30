import { z } from "zod";

import { NotificationTypeSchema, TargetTypeSchema } from "../enums";

export const notificationResponseSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  actorId: z.string().nullable(),
  actorUsername: z.string().nullable(),
  actorAvatarUrl: z.string().url().nullable(),
  targetType: TargetTypeSchema.nullable(),
  targetId: z.string().nullable(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
