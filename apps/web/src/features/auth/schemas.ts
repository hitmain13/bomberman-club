import { emailSchema, passwordSchema, usernameSchema } from "@bomberman/types";
import { z } from "zod";

export const loginFormSchema = z.object({
  identifier: z.string().min(3, "Informe seu usuário ou e-mail."),
  password: z.string().min(1, "Informe sua senha."),
});

export const registerFormSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Você precisa aceitar os termos." }),
    }),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "As senhas não conferem.",
      });
    }
  });

export const recoverFormSchema = z.object({
  email: emailSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type RecoverFormValues = z.infer<typeof recoverFormSchema>;
