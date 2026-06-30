import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SetCarSpecForm } from "./SetCarSpecForm";

describe("SetCarSpecForm", () => {
  it("renders enum options for ENUM definitions", () => {
    render(
      <SetCarSpecForm
        onSubmit={vi.fn()}
        definitions={[
          {
            id: "d_1",
            key: "stage",
            name: "Stage",
            type: "ENUM",
            unit: null,
            category: "engine",
            enumOptions: ["Stage 1", "Stage 2"],
          },
        ]}
      />,
    );
    expect(screen.getByText("Stage 1")).toBeInTheDocument();
    expect(screen.getByText("Stage 2")).toBeInTheDocument();
  });
});
