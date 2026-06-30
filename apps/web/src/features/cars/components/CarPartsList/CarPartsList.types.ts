import type { CarPartResponse } from "@bomberman/types";

export interface CarPartsListProps {
  parts: ReadonlyArray<CarPartResponse>;
  onRemove?: (carPartId: string) => void;
  readOnly?: boolean;
  className?: string;
}
