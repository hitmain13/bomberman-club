"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { cn } from "@/shared/utils/cn";

import { useRegister } from "../../hooks/use-register";
import { type RegisterFormValues, registerFormSchema } from "../../schemas";
import { getAuthErrorMessage } from "../../utils/error-message";

import { styles } from "./RegisterForm.styles";
import type { RegisterFormProps } from "./RegisterForm.types";

export function RegisterForm({ className }: RegisterFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });
  const mutation = useRegister();

  return (
    <form
      noValidate
      className={cn(styles.root, className)}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      {mutation.error ? (
        <p className={styles.error}>{getAuthErrorMessage(mutation.error)}</p>
      ) : null}
      <FormField
        label="Nome de usuário"
        placeholder="speed.fabio"
        autoComplete="username"
        errorMessage={errors.username?.message}
        {...register("username")}
      />
      <FormField
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        helperText="8+ caracteres com maiúscula, minúscula e número."
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <FormField
        label="Confirmar senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <label className={styles.terms}>
        <input type="checkbox" className={styles.termsCheckbox} {...register("acceptTerms")} />
        <span>
          Li e aceito os Termos de Uso e a Política de Privacidade.
          {errors.acceptTerms?.message ? (
            <span className={styles.termsError}> {errors.acceptTerms.message}</span>
          ) : null}
        </span>
      </label>
      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        Criar conta
      </Button>
    </form>
  );
}
