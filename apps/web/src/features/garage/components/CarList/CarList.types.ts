import type { CarResponse } from "@bomberman/types";

export interface CarListProps {
  cars: ReadonlyArray<CarResponse>;
  hrefFor?: (car: CarResponse) => string;
  className?: string;
}
