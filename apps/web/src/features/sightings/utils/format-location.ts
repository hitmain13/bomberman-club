import type { SightingResponse } from "@bomberman/types";

export function formatSightingLocation(
  sighting: Pick<SightingResponse, "street" | "locationLabel" | "latitude" | "longitude">,
): string {
  const label = sighting.street ?? sighting.locationLabel;
  if (label) {
    return label;
  }
  return `${sighting.latitude.toFixed(5)}, ${sighting.longitude.toFixed(5)}`;
}
