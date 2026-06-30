import type { CarResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarDetailHeader } from "./CarDetailHeader";

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

describe("CarDetailHeader", () => {
  it("renders the nickname and stage badge when provided", () => {
    render(<CarDetailHeader car={car} stageBadge="Stage 3" />);
    expect(screen.getByRole("heading", { name: "GTI Mk7" })).toBeInTheDocument();
    expect(screen.getByText("Stage 3")).toBeInTheDocument();
    expect(screen.getByText("2018")).toBeInTheDocument();
  });
});
