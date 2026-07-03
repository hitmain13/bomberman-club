import type { ExplorePerson } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

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
  {
    id: "u_3",
    username: "low.ds3",
    bio: null,
    city: "Belo Horizonte - MG",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    carsCount: 2,
    followersCount: 88,
    isFollowedByMe: true,
  },
];

const meta: Meta<typeof FeaturedPeopleRail> = {
  title: "Features/Discovery/FeaturedPeopleRail",
  component: FeaturedPeopleRail,
  args: { people },
};

export default meta;

type Story = StoryObj<typeof FeaturedPeopleRail>;

export const Default: Story = {};
