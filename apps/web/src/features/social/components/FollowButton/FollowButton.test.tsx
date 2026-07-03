import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { FollowButton } from "./FollowButton";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("FollowButton", () => {
  it("starts as 'Seguir' by default", () => {
    render(withClient(<FollowButton username="speed.fabio" />));
    expect(screen.getByRole("button", { name: "Seguir" })).toBeInTheDocument();
  });

  it("starts as 'Seguindo' when initialFollowing is true", () => {
    render(withClient(<FollowButton username="speed.fabio" initialFollowing />));
    expect(screen.getByRole("button", { name: "Seguindo" })).toBeInTheDocument();
  });
});
