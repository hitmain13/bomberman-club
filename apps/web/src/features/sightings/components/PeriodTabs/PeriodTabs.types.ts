import type { SightingPeriod } from "@bomberman/types";

export interface PeriodTabsProps {
  value: SightingPeriod;
  onChange: (value: SightingPeriod) => void;
  className?: string;
}
