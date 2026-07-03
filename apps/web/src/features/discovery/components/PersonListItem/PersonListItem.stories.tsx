import type { ExplorePerson } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

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

const meta: Meta<typeof PersonListItem> = {
  title: "Features/Discovery/PersonListItem",
  component: PersonListItem,
  args: { person },
  decorators: [(Story) => <ul>{Story()}</ul>],
};

export default meta;

type Story = StoryObj<typeof PersonListItem>;

export const Default: Story = {};
export const Following: Story = {
  args: { person: { ...person, isFollowedByMe: true } },
};
export const NoCity: Story = {
  args: { person: { ...person, city: null } },
};
