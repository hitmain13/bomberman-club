import { usernameSchema } from "@bomberman/types";
import { z } from "zod";

export const updateMeSchema = z
  .object({
    username: usernameSchema.optional(),
    bio: z.string().max(280).nullable().optional(),
    city: z.string().max(80).nullable().optional(),
    avatarUploadId: z.string().nullable().optional(),
  })
  .strict();

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
