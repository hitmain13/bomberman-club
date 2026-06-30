import type { SpecValueResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CarSpecsList } from "./CarSpecsList";

const specs: ReadonlyArray<SpecValueResponse> = [
  {
    id: "v_1",
    valueString: null,
    valueNumber: 1.4,
    valueBoolean: null,
    definition: {
      id: "d_1",
      key: "boost",
      name: "Pressão de turbo",
      type: "NUMBER",
      unit: "bar",
      category: "engine",
      enumOptions: null,
    },
  },
];

describe("CarSpecsList", () => {
  it("renders formatted value with unit", () => {
    render(<CarSpecsList specs={specs} />);
    expect(screen.getByText("Pressão de turbo")).toBeInTheDocument();
    expect(screen.getByText("1.4 bar")).toBeInTheDocument();
  });
});
