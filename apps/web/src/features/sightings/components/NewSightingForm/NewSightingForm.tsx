"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";
import { StatePanel } from "@/components/organisms/StatePanel";
import { reverseGeocode } from "@/shared/utils/reverse-geocode";

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

type Step = "photo" | "locating" | "form";

function localDatetimeNow(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function NewSightingForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  autoCapture = false,
}: NewSightingFormProps): JSX.Element {
  const upload = useUploadImage();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const autoCaptureTriggered = useRef(false);
  const [step, setStep] = useState<Step>("photo");
  const [preview, setPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
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
      locationLabel: null,
      occurredAt: localDatetimeNow(),
    },
  });

  const uploadId = watch("uploadId");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const hasLocation = latitude !== 0 || longitude !== 0;

  const applyLocation = async (lat: number, lng: number): Promise<void> => {
    setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
    setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
    const label = await reverseGeocode(lat, lng);
    setLocationLabel(label);
    setValue("locationLabel", label, { shouldValidate: true, shouldDirty: true });
  };

  const collectLocation = (): void => {
    setStep("locating");
    setGeoError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocalização não suportada neste dispositivo.");
      setStep("form");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyLocation(position.coords.latitude, position.coords.longitude).finally(() => {
          setStep("form");
        });
      },
      (error) => {
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Permissão de localização negada. Escolha no mapa."
            : "Não foi possível obter sua localização. Escolha no mapa.",
        );
        setStep("form");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  };

  const handlePhotoSelected = async (file: File): Promise<void> => {
    setPreview(URL.createObjectURL(file));
    const result = await upload.mutateAsync(file);
    setValue("uploadId", result.id, { shouldValidate: true });
    collectLocation();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    void handlePhotoSelected(file);
  };

  useEffect(() => {
    if (autoCapture && !autoCaptureTriggered.current && step === "photo") {
      autoCaptureTriggered.current = true;
      cameraInputRef.current?.click();
    }
  }, [autoCapture, step]);

  if (step === "photo") {
    return (
      <div className={styles.root}>
        <div className={styles.photoBox}>
          {preview ? (
            <Image src={preview} alt="Pré-visualização" fill className="object-cover" />
          ) : upload.isPending ? (
            <Spinner size="md" />
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <Icon name="camera" size="lg" />
              <p className="text-sm text-fg-secondary">Registre o flagrado com uma foto</p>
            </div>
          )}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="sr-only"
            onChange={handlePhotoChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handlePhotoChange}
          />
        </div>
        {upload.error ? <p className={styles.error}>Não foi possível enviar a foto.</p> : null}
        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            leadingIcon={<Icon name="camera" />}
            disabled={upload.isPending}
            onClick={() => cameraInputRef.current?.click()}
          >
            Abrir câmera
          </Button>
          <Button
            variant="secondary"
            fullWidth
            disabled={upload.isPending}
            onClick={() => galleryInputRef.current?.click()}
          >
            Escolher da galeria
          </Button>
        </div>
      </div>
    );
  }

  if (step === "locating") {
    return (
      <div className={styles.root}>
        <StatePanel
          kind="loading"
          title="Obtendo localização…"
          description="Aguarde um instante."
        />
      </div>
    );
  }

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
            locationLabel: values.locationLabel ?? locationLabel,
            occurredAt: values.occurredAt,
          }),
        )}
      >
        {preview ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-elevated">
            <Image src={preview} alt="Foto do flagrado" fill className="object-cover" />
          </div>
        ) : null}

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
        <input type="hidden" {...register("locationLabel")} />
        <div>
          <p className="pb-2 text-xs uppercase tracking-wider text-fg-muted">Localização</p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-border-default bg-bg-elevated px-4 py-3 text-left transition-colors hover:border-border-strong"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-fg-primary">
              <Icon name="map" size="sm" />
              <span className="truncate">
                {locationLabel ??
                  (hasLocation
                    ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                    : "Escolher no mapa")}
              </span>
            </span>
            <Icon name="chevron-right" size="sm" />
          </button>
          {geoError && !hasLocation ? <p className={`mt-1 ${styles.hint}`}>{geoError}</p> : null}
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
          void applyLocation(lat, lng);
          setPickerOpen(false);
        }}
      />
    </>
  );
}
