import type { Meta, StoryObj } from "@storybook/react";

import { ProfileAboutTab } from "./ProfileAboutTab";

const meta: Meta<typeof ProfileAboutTab> = {
  title: "Features/Profile/ProfileAboutTab",
  component: ProfileAboutTab,
  args: {
    bio: "Apaixonado por turbo, velocidade e setup bem feito.",
    city: "São Paulo - SP",
    memberSince: "2024-01-15T00:00:00.000Z",
    carsCount: 3,
    sightingsCount: 12,
  },
};

export default meta;

type Story = StoryObj<typeof ProfileAboutTab>;

export const Default: Story = {};
export const Empty: Story = { args: { bio: null, city: null, carsCount: 0, sightingsCount: 0 } };
