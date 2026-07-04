import type { SightingResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SightingCard } from "./SightingCard";

const sighting: SightingResponse = {
  id: "s_1",
  userId: "u_1",
  author: { id: "u_1", username: "speed.fabio", avatarUrl: null },
  uploadId: "up_1",
  imageUrl: "https://example.com/img.jpg",
  title: "Flagrado no encontro noturno",
  description: "Vista incrível com tanto carro novo.",
  latitude: -23.55,
  longitude: -46.63,
  street: "Rua Augusta, Consolação",
  locationLabel: "Rua Augusta, Consolação",
  occurredAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

describe("SightingCard", () => {
  it("renders title and author handle", () => {
    render(<SightingCard sighting={sighting} />);
    expect(screen.getByText("Flagrado no encontro noturno")).toBeInTheDocument();
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
  });
});
