import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials when no src is provided", () => {
    render(<Avatar src={null} alt="Fabio Rodrigues" />);
    expect(screen.getByLabelText("Fabio Rodrigues")).toHaveTextContent("FR");
  });
});
