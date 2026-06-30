import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders title and children", () => {
    render(
      <AuthLayout title="Entrar">
        <p>Form</p>
      </AuthLayout>,
    );
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByText("Form")).toBeInTheDocument();
  });
});
