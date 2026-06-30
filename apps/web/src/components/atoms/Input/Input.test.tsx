import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("marks as invalid via aria-invalid", () => {
    render(<Input placeholder="Email" invalid />);
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});
