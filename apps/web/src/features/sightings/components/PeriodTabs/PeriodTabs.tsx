"use client";

import type { SightingPeriod } from "@bomberman/types";

import { cn } from "@/shared/utils/cn";

import { styles } from "./PeriodTabs.styles";
import type { PeriodTabsProps } from "./PeriodTabs.types";

const OPTIONS: ReadonlyArray<{ value: SightingPeriod; label: string }> = [
  { value: "TODAY", label: "Hoje" },
  { value: "WEEK", label: "Semana" },
  { value: "MONTH", label: "Mês" },
  { value: "YEAR", label: "Ano" },
  { value: "ALL", label: "Tudo" },
];

export function PeriodTabs({ value, onChange, className }: PeriodTabsProps): JSX.Element {
  return (
    <div role="tablist" className={cn(styles.list, className)}>
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(styles.tab, active && styles.tabActive)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
