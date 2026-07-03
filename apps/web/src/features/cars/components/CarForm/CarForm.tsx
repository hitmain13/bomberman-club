"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";
import { useUploadImage } from "@/shared/hooks/use-upload-image";

import { type CarFormValues, carFormSchema } from "../../schemas";

import { styles } from "./CarForm.styles";
import type { CarFormProps } from "./CarForm.types";

const FUEL_OPTIONS: ReadonlyArray<{ value: CarFormValues["fuel"]; label: string }> = [
  { value: "GASOLINE", label: "Gasolina" },
  { value: "ETHANOL", label: "Etanol" },
  { value: "FLEX", label: "Flex" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Elétrico" },
  { value: "HYBRID", label: "Híbrido" },
  { value: "OTHER", label: "Outro" },
];

export function CarForm({
  garageId,
  initialCar,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: CarFormProps): JSX.Element {
  const upload = useUploadImage();
  const [preview, setPreview] = useState<string | null>(initialCar?.coverUrl ?? null);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: initialCar
      ? {
          garageId: initialCar.garageId,
          nickname: initialCar.nickname,
          brand: initialCar.brand,
          model: initialCar.model,
          generation: initialCar.generation ?? null,
          year: initialCar.year,
          fuel: initialCar.fuel,
          engine: initialCar.engine,
          weightKg: initialCar.weightKg,
          horsepowerHp: initialCar.horsepowerHp,
          torqueNm: initialCar.torqueNm,
          currentKm: initialCar.currentKm,
          plate: initialCar.plate ?? null,
          coverUploadId: initialCar.coverUploadId ?? null,
        }
      : {
          garageId,
          nickname: "",
          brand: "",
          model: "",
          generation: null,
          year: new Date().getFullYear(),
          fuel: "FLEX",
          engine: "",
          weightKg: 0,
          horsepowerHp: 0,
          torqueNm: 0,
          currentKm: 0,
          plate: null,
          coverUploadId: null,
        },
  });

  const coverUploadId = watch("coverUploadId");

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setPreview(URL.createObjectURL(file));
    const result = await upload.mutateAsync(file);
    setValue("coverUploadId", result.id, { shouldDirty: true });
  };

  return (
    <form noValidate className={styles.root} onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("garageId")} />
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Foto</p>
        <div className={styles.photoBox}>
          {preview ? (
            <Image src={preview} alt="Pré-visualização do carro" fill className="object-cover" />
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
        {coverUploadId ? <p className={styles.hint}>Foto pronta.</p> : null}
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Identidade</p>
        <FormField
          label="Apelido"
          placeholder="GTI Mk7"
          errorMessage={errors.nickname?.message}
          {...register("nickname")}
        />
        <div className={styles.grid}>
          <FormField
            label="Marca"
            placeholder="Volkswagen"
            errorMessage={errors.brand?.message}
            {...register("brand")}
          />
          <FormField
            label="Modelo"
            placeholder="Golf GTI"
            errorMessage={errors.model?.message}
            {...register("model")}
          />
        </div>
        <div className={styles.grid}>
          <FormField
            label="Geração (opcional)"
            placeholder="Mk7"
            errorMessage={errors.generation?.message}
            {...register("generation")}
          />
          <FormField
            label="Ano"
            type="number"
            inputMode="numeric"
            errorMessage={errors.year?.message}
            {...register("year", { valueAsNumber: true })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Motor</p>
        <FormField
          label="Motor"
          placeholder="EA888 2.0 TSI"
          errorMessage={errors.engine?.message}
          {...register("engine")}
        />
        <div className={styles.grid}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fuel" className="text-sm font-medium text-fg-secondary">
              Combustível
            </label>
            <select
              id="fuel"
              className="h-12 w-full rounded-md border border-border-default bg-bg-elevated px-3 text-base text-fg-primary"
              {...register("fuel")}
            >
              {FUEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Placa (opcional)"
            placeholder="ABC1D23"
            errorMessage={errors.plate?.message}
            {...register("plate")}
          />
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Performance</p>
        <div className={styles.grid}>
          <FormField
            label="Potência (cv)"
            type="number"
            inputMode="numeric"
            errorMessage={errors.horsepowerHp?.message}
            {...register("horsepowerHp", { valueAsNumber: true })}
          />
          <FormField
            label="Torque (Nm)"
            type="number"
            inputMode="numeric"
            errorMessage={errors.torqueNm?.message}
            {...register("torqueNm", { valueAsNumber: true })}
          />
        </div>
        <div className={styles.grid}>
          <FormField
            label="Peso (kg)"
            type="number"
            inputMode="numeric"
            errorMessage={errors.weightKg?.message}
            {...register("weightKg", { valueAsNumber: true })}
          />
          <FormField
            label="Quilometragem"
            type="number"
            inputMode="numeric"
            errorMessage={errors.currentKm?.message}
            {...register("currentKm", { valueAsNumber: true })}
          />
        </div>
      </section>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {initialCar ? "Salvar alterações" : "Criar carro"}
      </Button>
    </form>
  );
}
