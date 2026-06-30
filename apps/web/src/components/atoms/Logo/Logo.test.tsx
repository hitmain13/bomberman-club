import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders brand name", () => {
    render(<Logo />);
    expect(screen.getByLabelText("Bomberman Club")).toBeInTheDocument();
  });
});
