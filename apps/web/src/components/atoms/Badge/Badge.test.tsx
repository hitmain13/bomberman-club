import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Stage 3</Badge>);
    expect(screen.getByText("Stage 3")).toBeInTheDocument();
  });
});
