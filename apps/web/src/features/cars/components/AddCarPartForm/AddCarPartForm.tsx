"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/Button";

import { usePartCategories, usePartsByCategory } from "../../hooks/use-catalog";

import { styles } from "./AddCarPartForm.styles";
import type { AddCarPartFormProps } from "./AddCarPartForm.types";

export function AddCarPartForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: AddCarPartFormProps): JSX.Element {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [manufacturer, setManufacturer] = useState("");
  const [name, setName] = useState("");
  const categories = usePartCategories();
  const parts = usePartsByCategory(categoryId);

  const canSubmit = Boolean(categoryId) && manufacturer.trim().length > 0 && name.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!categoryId || !canSubmit) {
      return;
    }
    onSubmit({ categoryId, manufacturer: manufacturer.trim(), name: name.trim() });
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="part-category" className={styles.label}>
          Categoria
        </label>
        <select
          id="part-category"
          className={styles.select}
          value={categoryId ?? ""}
          onChange={(event) => {
            setCategoryId(event.target.value || null);
            setManufacturer("");
            setName("");
          }}
        >
          <option value="">Selecione</option>
          {categories.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="part-manufacturer" className={styles.label}>
            Fabricante
          </label>
          <input
            id="part-manufacturer"
            type="text"
            list="part-manufacturer-options"
            className={styles.select}
            placeholder="Garrett"
            value={manufacturer}
            disabled={!categoryId}
            onChange={(event) => setManufacturer(event.target.value)}
          />
          <datalist id="part-manufacturer-options">
            {[...new Set(parts.data?.map((part) => part.manufacturer))].map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="part-name" className={styles.label}>
            Peça
          </label>
          <input
            id="part-name"
            type="text"
            list="part-name-options"
            className={styles.select}
            placeholder="GTX2860"
            value={name}
            disabled={!categoryId}
            onChange={(event) => setName(event.target.value)}
          />
          <datalist id="part-name-options">
            {parts.data?.map((part) => (
              <option key={part.id} value={part.name} />
            ))}
          </datalist>
        </div>
      </div>
      {categoryId ? (
        <p className={styles.hint}>Já existente? Ela será reaproveitada automaticamente.</p>
      ) : null}

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!canSubmit}>
        Adicionar peça
      </Button>
    </form>
  );
}
