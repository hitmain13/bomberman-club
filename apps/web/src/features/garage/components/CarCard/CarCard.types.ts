import type { CarResponse } from "@bomberman/types";

export interface CarCardProps {
  car: CarResponse;
  href?: string | undefined;
  className?: string | undefined;
}
