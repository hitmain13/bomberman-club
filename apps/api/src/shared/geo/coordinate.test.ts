import { describe, expect, it } from "vitest";

import { geoCacheKey, roundCoordinate, roundCoordinates } from "./coordinate";

describe("roundCoordinates", () => {
  it("rounds to 5 decimal places for cache deduplication", () => {
    expect(roundCoordinate(-23.552912345, 5)).toBe(-23.55291);
    expect(roundCoordinates(-23.552912345, -46.696461234)).toEqual({
      latitude: -23.55291,
      longitude: -46.69646,
    });
  });

  it("builds stable cache keys for nearby coordinates", () => {
    const a = geoCacheKey(-23.552912, -46.696461);
    const b = geoCacheKey(-23.552913, -46.696462);
    expect(a).toBe(b);
    expect(a).toBe("bc:geo:reverse:-23.55291:-46.69646");
  });
});
