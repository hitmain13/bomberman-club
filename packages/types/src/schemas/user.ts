import { z } from "zod";

import { RoleSchema } from "../enums";

export const usernameSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[a-z0-9_.-]+$/, "Use letras minúsculas, números, ponto, hífen ou underline.");

export const emailSchema = z.string().email().max(120);

export const passwordSchema = z
  .string()
  .min(8, "Senha precisa ter ao menos 8 caracteres.")
  .max(72)
  .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
  .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
  .regex(/[0-9]/, "Inclua ao menos um número.");

export const publicUserSchema = z.object({
  id: z.string(),
  username: usernameSchema,
  bio: z.string().max(280).nullable(),
  city: z.string().max(80).nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
});

export const privateUserSchema = publicUserSchema.extend({
  email: emailSchema,
  role: RoleSchema,
});

export type PublicUser = z.infer<typeof publicUserSchema>;
export type PrivateUser = z.infer<typeof privateUserSchema>;
