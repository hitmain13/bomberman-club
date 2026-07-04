const COORD_DECIMALS = 5;

export function roundCoordinate(value: number, decimals = COORD_DECIMALS): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function roundCoordinates(
  latitude: number,
  longitude: number,
  decimals = COORD_DECIMALS,
): { latitude: number; longitude: number } {
  return {
    latitude: roundCoordinate(latitude, decimals),
    longitude: roundCoordinate(longitude, decimals),
  };
}

export function geoCacheKey(latitude: number, longitude: number): string {
  const rounded = roundCoordinates(latitude, longitude);
  return `bc:geo:reverse:${rounded.latitude}:${rounded.longitude}`;
}
