import type { SightingResponse } from "@bomberman/types";

export interface SightingCardProps {
  sighting: SightingResponse;
  href?: string | undefined;
  className?: string | undefined;
}
