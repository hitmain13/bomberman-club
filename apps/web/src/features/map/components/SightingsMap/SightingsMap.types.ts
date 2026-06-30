import type { SightingResponse } from "@bomberman/types";

export interface SightingsMapProps {
  sightings: ReadonlyArray<SightingResponse>;
  center?: [number, number];
  zoom?: number;
}
