import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileHeader } from "./ProfileHeader";

describe("ProfileHeader", () => {
  it("renders username, city and bio", () => {
    render(
      <ProfileHeader
        profile={{
          username: "speed.fabio",
          displayName: "Fábio Rodrigues",
          avatarUrl: null,
          city: "São Paulo - SP",
          bio: "Apaixonado por turbo.",
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Fábio Rodrigues" })).toBeInTheDocument();
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
    expect(screen.getByText("São Paulo - SP")).toBeInTheDocument();
    expect(screen.getByText("Apaixonado por turbo.")).toBeInTheDocument();
  });
});
