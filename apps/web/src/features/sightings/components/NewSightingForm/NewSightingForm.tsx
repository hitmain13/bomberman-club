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
import { compressImage } from "@/shared/utils/compress-image";

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

interface PhotoDraft {
  preview: string;
  uploadId: string;
}

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
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const autoCaptureTriggered = useRef(false);
  const [step, setStep] = useState<Step>("photo");
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
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
      uploadIds: [],
      title: "",
      description: "",
      latitude: 0,
      longitude: 0,
      occurredAt: localDatetimeNow(),
    },
  });

  const uploadIds = watch("uploadIds");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const hasLocation = latitude !== 0 || longitude !== 0;
  const coverPreview = photos[0]?.preview ?? null;

  const syncUploadIds = (nextPhotos: PhotoDraft[]): void => {
    setPhotos(nextPhotos);
    setValue(
      "uploadIds",
      nextPhotos.map((photo) => photo.uploadId),
      { shouldValidate: true },
    );
  };

  const applyLocation = (lat: number, lng: number): void => {
    setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
    setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
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
        applyLocation(position.coords.latitude, position.coords.longitude);
        setStep("form");
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

  const uploadFiles = async (files: File[]): Promise<void> => {
    const remaining = 10 - photos.length;
    const batch = files.slice(0, remaining);
    if (batch.length === 0) {
      return;
    }
    const uploaded: PhotoDraft[] = [];
    for (const file of batch) {
      const { file: compressed } = await compressImage(file);
      const result = await upload.mutateAsync(compressed);
      uploaded.push({ preview: URL.createObjectURL(compressed), uploadId: result.id });
    }
    const nextPhotos = [...photos, ...uploaded];
    syncUploadIds(nextPhotos);
    if (photos.length === 0) {
      collectLocation();
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fileList = event.target.files;
    event.target.value = "";
    if (!fileList || fileList.length === 0) {
      return;
    }
    void uploadFiles(Array.from(fileList));
  };

  const removePhoto = (uploadId: string): void => {
    syncUploadIds(photos.filter((photo) => photo.uploadId !== uploadId));
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
          {coverPreview ? (
            <Image src={coverPreview} alt="Pré-visualização" fill className="object-cover" />
          ) : upload.isPending ? (
            <Spinner size="md" />
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <Icon name="camera" size="lg" />
              <p className="text-sm text-fg-secondary">Registre o flagrado com até 10 fotos</p>
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
            multiple
            className="sr-only"
            onChange={handlePhotoChange}
          />
        </div>
        {photos.length > 0 ? (
          <p className={styles.hint}>{photos.length} foto(s) selecionada(s)</p>
        ) : null}
        {upload.error ? <p className={styles.error}>Não foi possível enviar a foto.</p> : null}
        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            leadingIcon={<Icon name="camera" />}
            disabled={upload.isPending || photos.length >= 10}
            onClick={() => cameraInputRef.current?.click()}
          >
            Abrir câmera
          </Button>
          <Button
            variant="secondary"
            fullWidth
            disabled={upload.isPending || photos.length >= 10}
            onClick={() => galleryInputRef.current?.click()}
          >
            Escolher da galeria
          </Button>
          {photos.length > 0 ? (
            <Button fullWidth onClick={() => setStep("form")}>
              Continuar
            </Button>
          ) : null}
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
            uploadIds: values.uploadIds,
            title: values.title,
            description: values.description ?? null,
            latitude: values.latitude,
            longitude: values.longitude,
            occurredAt: values.occurredAt,
          }),
        )}
      >
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.uploadId} className="relative aspect-square overflow-hidden rounded-md">
              <Image src={photo.preview} alt="Foto do flagrado" fill className="object-cover" />
              <button
                type="button"
                aria-label="Remover foto"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                onClick={() => removePhoto(photo.uploadId)}
              >
                <Icon name="x" size="sm" />
              </button>
            </div>
          ))}
        </div>
        {photos.length < 10 ? (
          <>
            <input
              ref={addMoreInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={handlePhotoChange}
            />
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={upload.isPending}
              onClick={() => addMoreInputRef.current?.click()}
            >
              Adicionar fotos
            </Button>
          </>
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
                {hasLocation
                  ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                  : "Escolher no mapa"}
              </span>
            </span>
            <Icon name="chevron-right" size="sm" />
          </button>
          {hasLocation ? (
            <p className={`mt-1 ${styles.hint}`}>
              O nome da rua será obtido automaticamente ao publicar.
            </p>
          ) : null}
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
          disabled={uploadIds.length === 0 || !hasLocation}
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
