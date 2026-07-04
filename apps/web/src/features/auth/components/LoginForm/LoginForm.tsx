"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { cn } from "@/shared/utils/cn";

import { useLogin } from "../../hooks/use-login";
import { type LoginFormValues, loginFormSchema } from "../../schemas";
import { getAuthErrorMessage } from "../../utils/error-message";

import { styles } from "./LoginForm.styles";
import type { LoginFormProps } from "./LoginForm.types";

export function LoginForm({ className }: LoginFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const mutation = useLogin();

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
        label="E-mail ou usuário"
        placeholder="Digite seu usuário ou e-mail"
        autoComplete="username"
        errorMessage={errors.identifier?.message}
        {...register("identifier")}
      />
      <FormField
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        autoComplete="current-password"
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <div className={styles.forgot}>
        <Link href="/recover" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        Entrar
      </Button>
    </form>
  );
}
