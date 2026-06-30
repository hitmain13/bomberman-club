import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "./FormField";

describe("FormField", () => {
  it("associates label with input", () => {
    render(<FormField label="Email" placeholder="seu@email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<FormField label="Email" errorMessage="Inválido" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Inválido");
  });
});
