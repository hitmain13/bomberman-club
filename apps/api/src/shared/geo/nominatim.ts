interface NominatimAddress {
  road?: string;
  pedestrian?: string;
  footway?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

export function streetFromNominatimAddress(address: NominatimAddress): string | null {
  const road = address.road ?? address.pedestrian ?? address.footway;
  if (!road) {
    return null;
  }
  const district =
    address.suburb ??
    address.neighbourhood ??
    address.city_district ??
    address.city ??
    address.town;
  return district ? `${road}, ${district}` : road;
}

export function streetFromNominatimPayload(data: NominatimResponse): string | null {
  if (data.address) {
    const street = streetFromNominatimAddress(data.address);
    if (street) {
      return street;
    }
  }
  if (data.display_name) {
    return data.display_name.split(",").slice(0, 2).join(",").trim();
  }
  return null;
}

export interface NominatimFetchOptions {
  latitude: number;
  longitude: number;
  userAgent: string;
  signal?: AbortSignal;
}

export async function fetchNominatimReverse(
  options: NominatimFetchOptions,
): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(options.latitude));
  url.searchParams.set("lon", String(options.longitude));
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": options.userAgent,
    },
    ...(options.signal ? { signal: options.signal } : {}),
  });

  if (!response.ok) {
    throw new Error(`Nominatim HTTP ${response.status}`);
  }

  const data = (await response.json()) as NominatimResponse;
  return streetFromNominatimPayload(data);
}
