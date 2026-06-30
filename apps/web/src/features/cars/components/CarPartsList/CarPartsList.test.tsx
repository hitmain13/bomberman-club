import type { CarPartResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarPartsList } from "./CarPartsList";

const part: CarPartResponse = {
  id: "cp_1",
  installedAt: null,
  description: null,
  part: { id: "p_1", categoryId: "cat_1", manufacturer: "Garrett", name: "GTX2860" },
  category: { id: "cat_1", slug: "turbo", name: "Turbina" },
};

describe("CarPartsList", () => {
  it("renders grouped parts with manufacturer", () => {
    render(<CarPartsList parts={[part]} readOnly />);
    expect(screen.getByText("Turbina")).toBeInTheDocument();
    expect(screen.getByText("Garrett")).toBeInTheDocument();
    expect(screen.getByText("GTX2860")).toBeInTheDocument();
  });
});
