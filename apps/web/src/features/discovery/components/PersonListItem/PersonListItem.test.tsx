import type { ExplorePerson } from "@bomberman/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { PersonListItem } from "./PersonListItem";

const person: ExplorePerson = {
  id: "u_1",
  username: "speed.fabio",
  bio: "Apaixonado por turbo.",
  city: "São Paulo - SP",
  avatarUrl: null,
  createdAt: new Date().toISOString(),
  carsCount: 3,
  followersCount: 128,
  isFollowedByMe: false,
};

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("PersonListItem", () => {
  it("renders username, city, counts and a follow button", () => {
    render(
      withClient(
        <ul>
          <PersonListItem person={person} />
        </ul>,
      ),
    );
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
    expect(screen.getByText(/São Paulo - SP/)).toBeInTheDocument();
    expect(screen.getByText(/3 carros/)).toBeInTheDocument();
    expect(screen.getByText(/128 seguidores/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seguir" })).toBeInTheDocument();
  });
});
