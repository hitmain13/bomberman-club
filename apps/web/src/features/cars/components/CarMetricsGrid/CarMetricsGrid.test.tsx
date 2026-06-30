import type { CarResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarMetricsGrid } from "./CarMetricsGrid";

const car: CarResponse = {
  id: "car_1",
  garageId: "garage_1",
  nickname: "GTI Mk7",
  brand: "Volkswagen",
  model: "Golf GTI",
  generation: "Mk7",
  year: 2018,
  fuel: "GASOLINE",
  engine: "EA888",
  weightKg: 1320,
  horsepowerHp: 320,
  torqueNm: 420,
  currentKm: 58_500,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("CarMetricsGrid", () => {
  it("renders metric labels", () => {
    render(<CarMetricsGrid car={car} />);
    expect(screen.getByText("Potência")).toBeInTheDocument();
    expect(screen.getByText("Peso")).toBeInTheDocument();
    expect(screen.getByText("Peso/Pot.")).toBeInTheDocument();
    expect(screen.getByText("Pot./Peso")).toBeInTheDocument();
  });
});
