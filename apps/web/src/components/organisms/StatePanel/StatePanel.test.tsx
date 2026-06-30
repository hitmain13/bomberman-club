import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatePanel } from "./StatePanel";

describe("StatePanel", () => {
  it("renders loading state with default title", () => {
    render(<StatePanel kind="loading" />);
    expect(screen.getByText("Carregando…")).toBeInTheDocument();
  });

  it("renders error state as alert", () => {
    render(<StatePanel kind="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
