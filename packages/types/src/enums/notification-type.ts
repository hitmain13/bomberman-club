import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "FOLLOW",
  "LIKE",
  "COMMENT",
  "MENTION",
  "SIGHTING_NEW",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
