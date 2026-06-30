"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";

import { useUploadImage } from "../../hooks/use-sighting-mutations";
import { type NewSightingPayload, type NewSightingValues, newSightingSchema } from "../../schemas";

import { styles } from "./NewSightingForm.styles";
import type { NewSightingFormProps } from "./NewSightingForm.types";

function localDatetimeNow(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function NewSightingForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: NewSightingFormProps): JSX.Element {
  const upload = useUploadImage();
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewSightingValues, undefined, NewSightingPayload>({
    resolver: zodResolver(newSightingSchema),
    defaultValues: {
      uploadId: "",
      title: "",
      description: "",
      latitude: 0,
      longitude: 0,
      occurredAt: localDatetimeNow(),
    },
  });

  const uploadId = watch("uploadId");

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setPreview(URL.createObjectURL(file));
    const result = await upload.mutateAsync(file);
    setValue("uploadId", result.id, { shouldValidate: true });
  };

  const handleLocate = (): void => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setValue("latitude", position.coords.latitude, { shouldValidate: true });
      setValue("longitude", position.coords.longitude, { shouldValidate: true });
    });
  };

  return (
    <form
      noValidate
      className={styles.root}
      onSubmit={handleSubmit((values) =>
        onSubmit({
          uploadId: values.uploadId,
          title: values.title,
          description: values.description ?? null,
          latitude: values.latitude,
          longitude: values.longitude,
          occurredAt: values.occurredAt,
        }),
      )}
    >
      <div className={styles.photoBox}>
        {preview ? (
          <Image src={preview} alt="Pré-visualização" fill className="object-cover" />
        ) : upload.isPending ? (
          <Spinner size="md" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon name="camera" size="lg" />
            <span>Toque para escolher uma foto</span>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.photoInput}
          onChange={(event) => {
            void handlePhotoChange(event);
          }}
        />
      </div>
      {errors.uploadId ? <p className={styles.hint}>{errors.uploadId.message}</p> : null}
      {uploadId ? <p className={styles.hint}>Foto pronta.</p> : null}

      <FormField
        label="Título"
        placeholder="Flagrado no encontro noturno"
        errorMessage={errors.title?.message}
        {...register("title")}
      />
      <FormField
        label="Descrição (opcional)"
        placeholder="Vista incrível com tanto carro novo."
        errorMessage={errors.description?.message}
        {...register("description")}
      />

      <div>
        <p className="pb-2 text-xs uppercase tracking-wider text-fg-muted">Localização</p>
        <div className={styles.locationRow}>
          <FormField
            label="Latitude"
            type="number"
            inputMode="decimal"
            step="any"
            errorMessage={errors.latitude?.message}
            className={styles.locationField}
            {...register("latitude", { valueAsNumber: true })}
          />
          <FormField
            label="Longitude"
            type="number"
            inputMode="decimal"
            step="any"
            errorMessage={errors.longitude?.message}
            className={styles.locationField}
            {...register("longitude", { valueAsNumber: true })}
          />
        </div>
        <Button variant="ghost" size="sm" type="button" onClick={handleLocate}>
          Usar minha localização atual
        </Button>
      </div>

      <FormField
        label="Data e hora"
        type="datetime-local"
        errorMessage={errors.occurredAt?.message}
        {...register("occurredAt")}
      />

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!uploadId}>
        Publicar flagrado
      </Button>
    </form>
  );
}
