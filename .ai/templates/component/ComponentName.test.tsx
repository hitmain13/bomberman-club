import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders the label", () => {
    render(<ComponentName label="hello" />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
