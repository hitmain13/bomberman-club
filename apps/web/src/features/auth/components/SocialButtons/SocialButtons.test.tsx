import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialButtons } from "./SocialButtons";

describe("SocialButtons", () => {
  it("renders providers", () => {
    render(<SocialButtons />);
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apple/i })).toBeInTheDocument();
  });
});
