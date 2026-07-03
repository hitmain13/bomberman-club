"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button";
import { BottomSheet } from "@/components/organisms/BottomSheet";
import { useSpecDefinitions } from "@/features/cars";

import { styles } from "./CarsFiltersSheet.styles";
import type { CarsFiltersSheetProps, CarsFiltersValue } from "./CarsFiltersSheet.types";

const SORT_OPTIONS: ReadonlyArray<{ value: CarsFiltersValue["sort"]; label: string }> = [
  { value: "NEWEST", label: "Mais novos" },
  { value: "MOST_POWERFUL", label: "Mais potentes" },
  { value: "LIGHTEST", label: "Mais leves" },
];

const EMPTY_VALUE: CarsFiltersValue = { stage: "", sort: "NEWEST" };

export function CarsFiltersSheet({
  open,
  value,
  onClose,
  onApply,
  onClear,
}: CarsFiltersSheetProps): JSX.Element | null {
  const [draft, setDraft] = useState<CarsFiltersValue>(value);
  const { data: definitions } = useSpecDefinitions();
  const stageOptions =
    definitions?.find((definition) => definition.key === "stage")?.enumOptions ?? [];

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  return (
    <BottomSheet
      open={open}
      title="Filtros"
      onClose={onClose}
      closeLabel="Limpar"
      footer={
        <Button
          fullWidth
          onClick={() => {
            onApply(draft);
            onClose();
          }}
        >
          Aplicar filtros
        </Button>
      }
    >
      <div className={styles.field}>
        <label htmlFor="cars-stage" className={styles.label}>
          Stage
        </label>
        <select
          id="cars-stage"
          className={styles.select}
          value={draft.stage}
          onChange={(event) => setDraft((prev) => ({ ...prev, stage: event.target.value }))}
        >
          <option value="">Qualquer stage</option>
          {stageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="cars-sort" className={styles.label}>
          Ordenar por
        </label>
        <select
          id="cars-sort"
          className={styles.select}
          value={draft.sort}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, sort: event.target.value as CarsFiltersValue["sort"] }))
          }
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="ghost"
        fullWidth
        onClick={() => {
          setDraft(EMPTY_VALUE);
          onClear();
          onClose();
        }}
      >
        Limpar tudo
      </Button>
    </BottomSheet>
  );
}
