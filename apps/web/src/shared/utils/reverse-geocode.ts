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

function streetFromAddress(address: NominatimAddress): string | null {
  const street = address.road ?? address.pedestrian ?? address.footway;
  if (!street) {
    return null;
  }
  const district =
    address.suburb ??
    address.neighbourhood ??
    address.city_district ??
    address.city ??
    address.town;
  return district ? `${street}, ${district}` : street;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "BombermanClub/1.0 (contact@bombermanclub.app)",
    },
  });
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as NominatimResponse;
  if (data.address) {
    const street = streetFromAddress(data.address);
    if (street) {
      return street;
    }
  }
  if (data.display_name) {
    return data.display_name.split(",").slice(0, 2).join(",").trim();
  }
  return null;
}
