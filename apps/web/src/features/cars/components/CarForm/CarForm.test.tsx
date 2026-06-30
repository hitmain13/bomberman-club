import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CarForm } from "./CarForm";

describe("CarForm", () => {
  it("renders sections with default values for a new car", () => {
    render(<CarForm garageId="g_1" onSubmit={vi.fn()} />);
    expect(screen.getByText("Identidade")).toBeInTheDocument();
    expect(screen.getAllByText("Motor").length).toBeGreaterThan(0);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByLabelText("Apelido")).toHaveValue("");
  });
});
