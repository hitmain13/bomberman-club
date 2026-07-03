import type { CarsSort } from "@bomberman/types";

export interface CarsFiltersValue {
  stage: string;
  sort: CarsSort;
}

export interface CarsFiltersSheetProps {
  open: boolean;
  value: CarsFiltersValue;
  onClose: () => void;
  onApply: (value: CarsFiltersValue) => void;
  onClear: () => void;
}
