import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileAboutTab } from "./ProfileAboutTab";

describe("ProfileAboutTab", () => {
  it("renders bio, city and stats", () => {
    render(
      <ProfileAboutTab
        bio="Apaixonado por turbo."
        city="São Paulo - SP"
        memberSince="2024-01-15T00:00:00.000Z"
        carsCount={3}
        sightingsCount={12}
      />,
    );
    expect(screen.getByText("Apaixonado por turbo.")).toBeInTheDocument();
    expect(screen.getByText("São Paulo - SP")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows fallback copy when bio and city are missing", () => {
    render(
      <ProfileAboutTab
        bio={null}
        city={null}
        memberSince="2024-01-15T00:00:00.000Z"
        carsCount={0}
        sightingsCount={0}
      />,
    );
    expect(screen.getByText("Sem bio ainda.")).toBeInTheDocument();
    expect(screen.getByText("Localização não informada.")).toBeInTheDocument();
  });
});
