import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { sightingResponseFixture } from "../../testing/sighting-fixture";

import { SightingCard } from "./SightingCard";

const sighting = sightingResponseFixture({
  title: "Flagrado no encontro noturno",
  description: "Vista incrível com tanto carro novo.",
  street: "Rua Augusta, Consolação",
  locationLabel: "Rua Augusta, Consolação",
});

describe("SightingCard", () => {
  it("renders title and author handle", () => {
    render(<SightingCard sighting={sighting} />);
    expect(screen.getByText("Flagrado no encontro noturno")).toBeInTheDocument();
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
  });
});
