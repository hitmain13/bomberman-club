import type { CarResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarList } from "./CarList";

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
  currentKm: 50_000,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("CarList", () => {
  it("renders every car", () => {
    render(<CarList cars={[car, { ...car, id: "car_2", nickname: "Civic Si" }]} />);
    expect(screen.getByText("GTI Mk7")).toBeInTheDocument();
    expect(screen.getByText("Civic Si")).toBeInTheDocument();
  });
});
