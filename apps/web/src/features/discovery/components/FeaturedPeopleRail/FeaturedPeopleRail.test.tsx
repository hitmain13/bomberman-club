import type { ExplorePerson } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturedPeopleRail } from "./FeaturedPeopleRail";

const people: ExplorePerson[] = [
  {
    id: "u_1",
    username: "speed.fabio",
    bio: null,
    city: "São Paulo - SP",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    carsCount: 3,
    followersCount: 128,
    isFollowedByMe: false,
  },
  {
    id: "u_2",
    username: "turbo.gti",
    bio: null,
    city: "Curitiba - PR",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    carsCount: 1,
    followersCount: 40,
    isFollowedByMe: false,
  },
];

describe("FeaturedPeopleRail", () => {
  it("renders every featured person", () => {
    render(<FeaturedPeopleRail people={people} />);
    expect(screen.getByText("@speed.fabio")).toBeInTheDocument();
    expect(screen.getByText("@turbo.gti")).toBeInTheDocument();
  });
});
