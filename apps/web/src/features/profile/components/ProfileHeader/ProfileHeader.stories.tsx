import type { Meta, StoryObj } from "@storybook/react";

import { ProfileHeader } from "./ProfileHeader";

const meta: Meta<typeof ProfileHeader> = {
  title: "Features/Profile/ProfileHeader",
  component: ProfileHeader,
};

export default meta;

type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
    profile: {
      username: "speed.fabio",
      displayName: "Fábio Rodrigues",
      avatarUrl: null,
      city: "São Paulo - SP",
      bio: "Apaixonado por turbo, velocidade e setup bem feito.",
    },
  },
};

export const Minimal: Story = {
  args: {
    profile: {
      username: "vinte.dois",
      displayName: null,
      avatarUrl: null,
      city: null,
      bio: null,
    },
  },
};
