"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { cn } from "@/shared/utils/cn";

import { useRecoverPassword } from "../../hooks/use-recover-password";
import { type RecoverFormValues, recoverFormSchema } from "../../schemas";
import { getAuthErrorMessage } from "../../utils/error-message";

import { styles } from "./RecoverForm.styles";
import type { RecoverFormProps } from "./RecoverForm.types";

export function RecoverForm({ className }: RecoverFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverFormSchema),
    defaultValues: { email: "" },
  });
  const mutation = useRecoverPassword();

  return (
    <form
      noValidate
      className={cn(styles.root, className)}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      {mutation.error ? (
        <p className={styles.error}>{getAuthErrorMessage(mutation.error)}</p>
      ) : null}
      {mutation.data ? (
        <p className={styles.success}>
          Enviamos um link de recuperação para <strong>{mutation.data.sentTo}</strong>.
        </p>
      ) : null}
      <FormField
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        Enviar link
      </Button>
    </form>
  );
}
