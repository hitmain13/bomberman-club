"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { buttonBase, buttonSizes, buttonVariants } from "@/components/atoms/Button/Button.styles";
import { Icon } from "@/components/atoms/Icon";
import { FormField } from "@/components/molecules/FormField";
import { errorMessageFromUpload, uploadImageFile } from "@/shared/hooks/use-upload-image";
import { cn } from "@/shared/utils/cn";

import { useReverseGeocode } from "../../hooks/use-reverse-geocode";
import { type NewSightingPayload, type NewSightingValues, newSightingSchema } from "../../schemas";
import { type PhotoDraftItem, SortablePhotoGrid } from "../SortablePhotoGrid/SortablePhotoGrid";
import { reorderPhotos } from "../SortablePhotoGrid/SortablePhotoGrid.logic";

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

function createLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function NewSightingForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  autoCapture = false,
}: NewSightingFormProps): JSX.Element {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const autoCaptureTriggered = useRef(false);
  const geolocationRequested = useRef(false);
  const uploadChainRef = useRef(Promise.resolve());
  const photosRef = useRef<PhotoDraftItem[]>([]);
  const [photos, setPhotos] = useState<PhotoDraftItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
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
  photosRef.current = photos;
  const hasLocation = latitude !== 0 || longitude !== 0;
  const reverseGeocode = useReverseGeocode(
    hasLocation ? latitude : null,
    hasLocation ? longitude : null,
  );
  const hasPhotos = photos.length > 0;
  const allUploaded = photos.length > 0 && photos.every((photo) => photo.status === "done");
  const anyUploading = photos.some((photo) => photo.status === "uploading");

  const applyLocation = useCallback(
    (lat: number, lng: number, label?: string | null): void => {
      setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
      setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
      setValue("street", label ?? null, { shouldDirty: true });
      setLocationLabel(label ?? null);
      setLocating(false);
    },
    [setValue],
  );

  const requestLocation = useCallback((): void => {
    if (geolocationRequested.current) {
      return;
    }
    geolocationRequested.current = true;
    setLocating(true);
    setGeoError(null);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocalização não suportada neste dispositivo.");
      setLocating(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setGeoError("Não foi possível obter sua localização. Escolha no mapa.");
      setLocating(false);
    }, 12_000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timeout);
        applyLocation(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      (error) => {
        window.clearTimeout(timeout);
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Permissão de localização negada. Escolha no mapa."
            : "Não foi possível obter sua localização. Escolha no mapa.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [applyLocation]);

  const syncUploadIds = useCallback(
    (nextPhotos: PhotoDraftItem[]): void => {
      setValue(
        "uploadIds",
        nextPhotos.filter((photo) => photo.uploadId).map((photo) => photo.uploadId as string),
        { shouldValidate: true },
      );
    },
    [setValue],
  );

  const enqueueUpload = useCallback(
    (file: File, localId: string): void => {
      uploadChainRef.current = uploadChainRef.current
        .catch(() => undefined)
        .then(() => uploadImageFile(file))
        .then((result) => {
          setPhotos((current) => {
            const next = current.map((photo) =>
              photo.localId === localId
                ? { ...photo, uploadId: result.id, status: "done" as const }
                : photo,
            );
            syncUploadIds(next);
            return next;
          });
        })
        .catch((error) => {
          setPhotos((current) =>
            current.map((photo) =>
              photo.localId === localId
                ? {
                    ...photo,
                    status: "error" as const,
                    errorMessage: errorMessageFromUpload(error),
                  }
                : photo,
            ),
          );
        });
    },
    [syncUploadIds],
  );

  const addFiles = useCallback(
    (files: File[]): void => {
      const current = photosRef.current;
      const remaining = 10 - current.length;
      const batch = files.slice(0, remaining);
      if (batch.length === 0) {
        return;
      }

      const shouldRequestLocation = current.length === 0;
      const optimistic = batch.map((file) => ({
        localId: createLocalId(),
        preview: URL.createObjectURL(file),
        file,
        uploadId: null,
        status: "uploading" as const,
      }));

      setPhotos([...current, ...optimistic]);

      if (shouldRequestLocation) {
        requestLocation();
      }

      batch.forEach((file, index) => {
        const draft = optimistic[index];
        if (draft) {
          enqueueUpload(file, draft.localId);
        }
      });
    },
    [enqueueUpload, requestLocation],
  );

  const handlePhotoInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) {
      return;
    }
    addFiles(files);
    event.target.value = "";
  };

  const removePhoto = (localId: string): void => {
    setPhotos((current) => {
      const next = current.filter((photo) => photo.localId !== localId);
      syncUploadIds(next);
      return next;
    });
  };

  const handleReorder = (fromIndex: number, toIndex: number): void => {
    setPhotos((current) => {
      const next = reorderPhotos(current, fromIndex, toIndex);
      syncUploadIds(next);
      return next;
    });
  };

  const handleRetryUpload = useCallback(
    (localId: string): void => {
      setPhotos((current) =>
        current.map((photo) => {
          if (photo.localId !== localId) {
            return photo;
          }
          const { errorMessage: _, ...rest } = photo;
          return { ...rest, status: "uploading" as const };
        }),
      );
      const photo = photosRef.current.find((entry) => entry.localId === localId);
      if (photo) {
        enqueueUpload(photo.file, localId);
      }
    },
    [enqueueUpload],
  );

  useEffect(() => {
    if (reverseGeocode.data?.label && !locationLabel) {
      setLocationLabel(reverseGeocode.data.label);
      setValue("street", reverseGeocode.data.label, { shouldDirty: true });
    }
  }, [locationLabel, reverseGeocode.data?.label, setValue]);

  const locationDisplay = locating
    ? "Obtendo localização…"
    : hasLocation
      ? (locationLabel ??
        reverseGeocode.data?.label ??
        (reverseGeocode.isLoading ? "Obtendo endereço…" : "Endereço indisponível"))
      : "Escolher no mapa";

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (autoCapture && !autoCaptureTriggered.current && !hasPhotos) {
      autoCaptureTriggered.current = true;
      cameraInputRef.current?.click();
    }
  }, [autoCapture, hasPhotos]);

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
            street: values.street ?? locationLabel,
            occurredAt: values.occurredAt,
          }),
        )}
      >
        {!hasPhotos ? (
          <div className="flex flex-col gap-2">
            <div className={styles.photoBox}>
              <div className="flex flex-col items-center gap-3 p-4 text-center">
                <Icon name="camera" size="lg" />
                <p className="text-sm text-fg-secondary">Registre o flagrado com até 10 fotos</p>
              </div>
            </div>
            <label
              className={cn(
                buttonBase,
                buttonVariants.primary,
                buttonSizes.md,
                "relative w-full cursor-pointer",
              )}
            >
              <Icon name="camera" />
              <span>Abrir câmera</span>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                aria-label="Abrir câmera"
                className={styles.photoInput}
                onChange={handlePhotoInput}
              />
            </label>
            <label
              className={cn(
                buttonBase,
                buttonVariants.secondary,
                buttonSizes.md,
                "relative w-full cursor-pointer",
              )}
            >
              <span>Escolher da galeria</span>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                aria-label="Escolher da galeria"
                className={styles.photoInput}
                onChange={handlePhotoInput}
              />
            </label>
          </div>
        ) : (
          <>
            <SortablePhotoGrid
              photos={photos}
              onReorder={handleReorder}
              onRemove={removePhoto}
              onRetry={handleRetryUpload}
            />
            {photos.length > 1 ? (
              <p className={styles.hint}>Arraste para reordenar. A primeira foto é a capa.</p>
            ) : null}
            {photos.length < 10 ? (
              <label
                className={cn(
                  buttonBase,
                  buttonVariants.secondary,
                  buttonSizes.md,
                  "relative w-full cursor-pointer",
                )}
              >
                <span>Adicionar fotos</span>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  multiple
                  aria-label="Adicionar fotos"
                  className={styles.photoInput}
                  onChange={handlePhotoInput}
                />
              </label>
            ) : null}
            {anyUploading ? (
              <p className={styles.hint}>
                Enviando fotos… você já pode preencher os campos abaixo.
              </p>
            ) : null}
          </>
        )}

        <FormField
          label="Título"
          placeholder="Flagrado no encontro noturno"
          errorMessage={errors.title?.message}
          disabled={!hasPhotos}
          {...register("title")}
        />
        <FormField
          label="Descrição (opcional)"
          placeholder="Vista incrível com tanto carro novo."
          errorMessage={errors.description?.message}
          disabled={!hasPhotos}
          {...register("description")}
        />

        <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
        <input type="hidden" {...register("longitude", { valueAsNumber: true })} />
        <input type="hidden" {...register("street")} />
        <div>
          <p className="pb-2 text-xs uppercase tracking-wider text-fg-muted">Localização</p>
          <button
            type="button"
            disabled={!hasPhotos}
            onClick={() => setPickerOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-border-default bg-bg-elevated px-4 py-3 text-left transition-colors hover:border-border-strong disabled:opacity-50"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-fg-primary">
              <Icon name="map" size="sm" />
              <span className="truncate">{locationDisplay}</span>
            </span>
            <Icon name="chevron-right" size="sm" />
          </button>
          {!hasLocation && !locating ? (
            <button
              type="button"
              onClick={() => {
                geolocationRequested.current = false;
                requestLocation();
              }}
              className="mt-1 text-xs text-fg-secondary underline"
            >
              Usar minha localização
            </button>
          ) : null}
          {hasLocation ? (
            <p className={`mt-1 ${styles.hint}`}>
              {locationLabel || reverseGeocode.data?.label
                ? "Endereço confirmado para publicação."
                : "O endereço será obtido automaticamente se necessário."}
            </p>
          ) : null}
          {geoError && !hasLocation && !locating ? (
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
          disabled={!hasPhotos}
          {...register("occurredAt")}
        />

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={!hasPhotos || !allUploaded || !hasLocation || uploadIds.length === 0}
        >
          Publicar flagrado
        </Button>
      </form>

      <LocationPicker
        open={pickerOpen}
        initialLatitude={hasLocation ? latitude : null}
        initialLongitude={hasLocation ? longitude : null}
        initialLabel={locationLabel}
        onCancel={() => setPickerOpen(false)}
        onConfirm={(lat, lng, label) => {
          applyLocation(lat, lng, label);
          setPickerOpen(false);
        }}
      />
    </>
  );
}
