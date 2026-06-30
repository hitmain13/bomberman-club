import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text } from "./Text";

describe("Text", () => {
  it("renders children", () => {
    render(<Text>Olá</Text>);
    expect(screen.getByText("Olá")).toBeInTheDocument();
  });

  it("renders as the provided element", () => {
    render(
      <Text as="h1" variant="title">
        Título
      </Text>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Título" })).toBeInTheDocument();
  });
});
