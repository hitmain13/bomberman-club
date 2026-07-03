"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarPreviewRef = useRef<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
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
  const canSave = isDirty || pendingAvatarFile !== null;

  useEffect(() => {
    return () => {
      if (avatarPreviewRef.current) {
        URL.revokeObjectURL(avatarPreviewRef.current);
      }
    };
  }, []);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (avatarPreviewRef.current) {
      URL.revokeObjectURL(avatarPreviewRef.current);
    }
    const preview = URL.createObjectURL(file);
    avatarPreviewRef.current = preview;
    setPendingAvatarFile(file);
    setAvatarUrl(preview);
  };

  return (
    <form
      noValidate
      className={cn(styles.root, className)}
      onSubmit={handleSubmit((values) =>
        mutation.mutate({ values, avatarFile: pendingAvatarFile }),
      )}
    >
      <div className={styles.avatarRow}>
        <Avatar src={avatarUrl} alt={user.username} size="xl" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handlePhotoSelect}
        />
        <button
          type="button"
          className={styles.changePhoto}
          disabled={mutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
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
      <Button type="submit" fullWidth isLoading={mutation.isPending} disabled={!canSave}>
        Salvar alterações
      </Button>
    </form>
  );
}
