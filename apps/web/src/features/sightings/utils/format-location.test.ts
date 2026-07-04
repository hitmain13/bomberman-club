import { describe, expect, it } from "vitest";

import { formatSightingLocation } from "./format-location";

describe("formatSightingLocation", () => {
  const base = {
    latitude: -23.55291,
    longitude: -46.69646,
    street: null as string | null,
    locationLabel: null as string | null,
  };

  it("prefers street over coordinates", () => {
    expect(formatSightingLocation({ ...base, street: "Rua Lira, Vila Madalena" })).toBe(
      "Rua Lira, Vila Madalena",
    );
  });

  it("falls back to locationLabel then coordinates", () => {
    expect(formatSightingLocation({ ...base, locationLabel: "Rua Augusta" })).toBe("Rua Augusta");
    expect(formatSightingLocation(base)).toBe("-23.55291, -46.69646");
  });
});
