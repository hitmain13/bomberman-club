import type { CarResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarCard } from "./CarCard";

const car: CarResponse = {
  id: "car_1",
  garageId: "garage_1",
  nickname: "GTI Mk7",
  brand: "Volkswagen",
  model: "Golf GTI",
  generation: "Mk7",
  year: 2018,
  fuel: "GASOLINE",
  engine: "EA888 2.0 TSI",
  weightKg: 1320,
  horsepowerHp: 320,
  torqueNm: 420,
  currentKm: 58_500,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("CarCard", () => {
  it("renders nickname, brand+model and metrics", () => {
    render(<CarCard car={car} />);
    expect(screen.getByText("GTI Mk7")).toBeInTheDocument();
    expect(screen.getByText(/Volkswagen Golf GTI/)).toBeInTheDocument();
    expect(screen.getByText("320 cv")).toBeInTheDocument();
    expect(screen.getByText("1.320 kg")).toBeInTheDocument();
    expect(screen.getByText("4,13")).toBeInTheDocument();
  });

  it("does not render an owner row by default", () => {
    render(<CarCard car={car} />);
    expect(screen.queryByText(/^@/)).not.toBeInTheDocument();
  });

  it("renders the owner row when provided", () => {
    render(<CarCard car={car} owner={{ username: "speed.fabio", avatarUrl: null }} />);
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver perfil de @speed.fabio" })).toHaveAttribute(
      "href",
      "/u/speed.fabio",
    );
  });
});
