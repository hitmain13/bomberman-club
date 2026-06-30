import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { LikeButton } from "./LikeButton";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("LikeButton", () => {
  it("renders count and is not pressed initially", () => {
    render(withClient(<LikeButton targetType="SIGHTING" targetId="s1" initialCount={42} />));
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("42");
  });
});
