"use client";

import type { FeedScope } from "@bomberman/types";

import { cn } from "@/shared/utils/cn";

import { styles } from "./FeedTabs.styles";
import type { FeedTabsProps } from "./FeedTabs.types";

const OPTIONS: ReadonlyArray<{ value: FeedScope; label: string }> = [
  { value: "FORYOU", label: "Para você" },
  { value: "FOLLOWING", label: "Seguindo" },
  { value: "RECENT", label: "Recentes" },
];

export function FeedTabs({ value, onChange }: FeedTabsProps): JSX.Element {
  return (
    <div role="tablist" className={styles.list}>
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
