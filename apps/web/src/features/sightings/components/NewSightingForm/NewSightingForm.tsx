"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";

import { useUploadImage } from "../../hooks/use-sighting-mutations";
import { type NewSightingPayload, type NewSightingValues, newSightingSchema } from "../../schemas";

import { styles } from "./NewSightingForm.styles";
import type { NewSightingFormProps } from "./NewSightingForm.types";

const LocationPicker = dynamic(
  () =>
    import("../LocationPicker/LocationPicker").then((module) => ({
      default: module.LocationPicker,
    })),
  { ssr: false },
);

function localDatetimeNow(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

function formatCoordPair(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function NewSightingForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: NewSightingFormProps): JSX.Element {
  const upload = useUploadImage();
  const [preview, setPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
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
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const hasLocation = latitude !== 0 || longitude !== 0;

  const applyLocation = (lat: number, lng: number): void => {
    setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
    setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoLoading(false);
      setGeoError("Geolocalização não suportada neste dispositivo.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("longitude", position.coords.longitude, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Permissão de localização negada. Escolha no mapa."
            : "Não foi possível obter sua localização. Escolha no mapa.",
        );
      },
      { enableHighAccuracy: true, timeout: 8_000, maximumAge: 60_000 },
    );
  }, [setValue]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setPreview(URL.createObjectURL(file));
    const result = await upload.mutateAsync(file);
    setValue("uploadId", result.id, { shouldValidate: true });
  };

  return (
    <>
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

        <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
        <input type="hidden" {...register("longitude", { valueAsNumber: true })} />
        <div>
          <p className="pb-2 text-xs uppercase tracking-wider text-fg-muted">Localização</p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-border-default bg-bg-elevated px-4 py-3 text-left transition-colors hover:border-border-strong"
          >
            <span className="flex items-center gap-2 text-sm text-fg-primary">
              <Icon name="map" size="sm" />
              {geoLoading
                ? "Buscando sua localização…"
                : hasLocation
                  ? formatCoordPair(latitude, longitude)
                  : "Escolher no mapa"}
            </span>
            <Icon name="chevron-right" size="sm" />
          </button>
          {!geoLoading && geoError && !hasLocation ? (
            <p className={`mt-1 ${styles.hint}`}>{geoError}</p>
          ) : null}
          {errors.latitude || errors.longitude ? (
            <p className={`mt-1 ${styles.hint}`}>Selecione um local válido.</p>
          ) : null}
        </div>

        <FormField
          label="Data e hora"
          type="datetime-local"
          errorMessage={errors.occurredAt?.message}
          {...register("occurredAt")}
        />

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={!uploadId || !hasLocation}
        >
          Publicar flagrado
        </Button>
      </form>

      <LocationPicker
        open={pickerOpen}
        initialLatitude={hasLocation ? latitude : null}
        initialLongitude={hasLocation ? longitude : null}
        onCancel={() => setPickerOpen(false)}
        onConfirm={(lat, lng) => {
          applyLocation(lat, lng);
          setPickerOpen(false);
        }}
      />
    </>
  );
}
