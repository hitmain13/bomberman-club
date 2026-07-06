import type { SightingResponse } from "@bomberman/types";

const FALLBACK_LABEL = "Endereço indisponível";

export function formatSightingLocation(
  sighting: Pick<SightingResponse, "street" | "locationLabel" | "latitude" | "longitude">,
): string {
  const label = sighting.street ?? sighting.locationLabel;
  if (label) {
    return label;
  }
  return FALLBACK_LABEL;
}
