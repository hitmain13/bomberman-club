import { describe, expect, it } from "vitest";

import { CarBuilder } from "./car.builder";

describe("CarBuilder", () => {
  it("builds a complete car input", () => {
    const data = new CarBuilder()
      .forGarage("garage_1")
      .named("GTI Mk7")
      .ofModel("Volkswagen", "Golf GTI", "Mk7")
      .ofYear(2018)
      .withFuel("GASOLINE")
      .withEngine("EA888 2.0 TSI")
      .withWeight(1320)
      .withPower(320, 420)
      .withKm(58_500)
      .withPlate("ABC1D23")
      .build();
    expect(data.nickname).toBe("GTI Mk7");
    expect(data.horsepowerHp).toBe(320);
    expect(data.weightKg).toBe(1320);
    expect(data.fuel).toBe("GASOLINE");
  });

  it("throws when a required field is missing", () => {
    expect(() => new CarBuilder().named("GTI").build()).toThrowError(/garageId/);
  });
});
