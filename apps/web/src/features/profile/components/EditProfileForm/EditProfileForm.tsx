"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { getAuthErrorMessage } from "@/features/auth/utils/error-message";
import { cn } from "@/shared/utils/cn";

import { useUpdateProfile } from "../../hooks/use-update-profile";
import { type EditProfileValues, editProfileSchema } from "../../schemas";

import { styles } from "./EditProfileForm.styles";
import type { EditProfileFormProps } from "./EditProfileForm.types";

export function EditProfileForm({ user, className }: EditProfileFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user.username,
      bio: user.bio ?? "",
      city: user.city ?? "",
    },
  });
  const mutation = useUpdateProfile();

  return (
    <form
      noValidate
      className={cn(styles.root, className)}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <div className={styles.avatarRow}>
        <Avatar src={user.avatarUrl} alt={user.username} size="xl" />
        <button type="button" className={styles.changePhoto} disabled>
          Alterar foto
        </button>
      </div>
      {mutation.error ? (
        <p className={styles.error}>{getAuthErrorMessage(mutation.error)}</p>
      ) : null}
      <FormField
        label="Nome de usuário"
        autoComplete="username"
        errorMessage={errors.username?.message}
        {...register("username")}
      />
      <FormField
        label="Cidade"
        placeholder="São Paulo - SP"
        autoComplete="address-level2"
        errorMessage={errors.city?.message}
        {...register("city")}
      />
      <FormField
        label="Bio"
        placeholder="Apaixonado por turbo, velocidade e setup bem feito."
        errorMessage={errors.bio?.message}
        {...register("bio")}
      />
      <Button type="submit" fullWidth isLoading={mutation.isPending} disabled={!isDirty}>
        Salvar alterações
      </Button>
    </form>
  );
}
