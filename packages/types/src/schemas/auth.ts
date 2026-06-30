import { z } from "zod";

import { emailSchema, passwordSchema, privateUserSchema, usernameSchema } from "./user";

export const registerInputSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const authResponseSchema = z.object({
  user: privateUserSchema,
  accessToken: z.string(),
  expiresIn: z.number().int().positive(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
