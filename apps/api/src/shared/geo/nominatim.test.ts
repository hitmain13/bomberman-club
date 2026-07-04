import { describe, expect, it } from "vitest";

import { streetFromNominatimAddress, streetFromNominatimPayload } from "./nominatim";

describe("streetFromNominatimPayload", () => {
  it("extracts road and district from address", () => {
    expect(
      streetFromNominatimAddress({
        road: "Rua Lira",
        suburb: "Vila Madalena",
      }),
    ).toBe("Rua Lira, Vila Madalena");
  });

  it("falls back to display_name segments", () => {
    expect(
      streetFromNominatimPayload({
        display_name: "Rua Lira, Vila Madalena, São Paulo, Brasil",
      }),
    ).toBe("Rua Lira, Vila Madalena");
  });

  it("returns null when no usable data", () => {
    expect(streetFromNominatimPayload({})).toBeNull();
  });
});
