import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileStats } from "./ProfileStats";

describe("ProfileStats", () => {
  it("renders each metric", () => {
    render(
      <ProfileStats
        items={[
          { label: "Carros", value: 3 },
          { label: "Flagrados", value: 12 },
          { label: "Seguidores", value: 128 },
        ]}
      />,
    );
    expect(screen.getByText("Carros")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });
});
