import { usernameSchema } from "@bomberman/types";
import { z } from "zod";

export const editProfileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(280).optional(),
  city: z.string().max(80).optional(),
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;
