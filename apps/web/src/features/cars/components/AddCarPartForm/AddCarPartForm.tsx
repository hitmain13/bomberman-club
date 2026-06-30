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
  const [partId, setPartId] = useState<string | null>(null);
  const categories = usePartCategories();
  const parts = usePartsByCategory(categoryId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!partId) {
      return;
    }
    onSubmit({ partId });
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
            setPartId(null);
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="part" className={styles.label}>
          Peça
        </label>
        <select
          id="part"
          className={styles.select}
          value={partId ?? ""}
          onChange={(event) => setPartId(event.target.value || null)}
          disabled={!categoryId}
        >
          <option value="">{categoryId ? "Selecione" : "Escolha uma categoria primeiro"}</option>
          {parts.data?.map((part) => (
            <option key={part.id} value={part.id}>
              {part.manufacturer} · {part.name}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!partId}>
        Adicionar peça
      </Button>
    </form>
  );
}
