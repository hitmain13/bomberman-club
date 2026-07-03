"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { BottomSheet } from "@/components/organisms/BottomSheet";

import { styles } from "./PeopleFiltersSheet.styles";
import type {
  MemberSinceOption,
  PeopleFiltersSheetProps,
  PeopleFiltersValue,
} from "./PeopleFiltersSheet.types";

const SORT_OPTIONS: ReadonlyArray<{ value: PeopleFiltersValue["sort"]; label: string }> = [
  { value: "RECENT", label: "Mais recentes" },
  { value: "FOLLOWERS", label: "Mais seguidores" },
];

const SINCE_OPTIONS: ReadonlyArray<{ value: MemberSinceOption; label: string }> = [
  { value: "ALL", label: "Qualquer data" },
  { value: "LAST_30_DAYS", label: "Últimos 30 dias" },
  { value: "THIS_YEAR", label: "Este ano" },
];

const EMPTY_VALUE: PeopleFiltersValue = { city: "", sort: "RECENT", memberSince: "ALL" };

export function PeopleFiltersSheet({
  open,
  value,
  onClose,
  onApply,
  onClear,
}: PeopleFiltersSheetProps): JSX.Element | null {
  const [draft, setDraft] = useState<PeopleFiltersValue>(value);

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
      <FormField
        label="Localização"
        placeholder="Todas as cidades"
        value={draft.city}
        onChange={(event) => setDraft((prev) => ({ ...prev, city: event.target.value }))}
      />

      <div className={styles.field}>
        <label htmlFor="people-sort" className={styles.label}>
          Ordenar por
        </label>
        <select
          id="people-sort"
          className={styles.select}
          value={draft.sort}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              sort: event.target.value as PeopleFiltersValue["sort"],
            }))
          }
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="people-since" className={styles.label}>
          Membro desde
        </label>
        <select
          id="people-since"
          className={styles.select}
          value={draft.memberSince}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              memberSince: event.target.value as MemberSinceOption,
            }))
          }
        >
          {SINCE_OPTIONS.map((option) => (
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
