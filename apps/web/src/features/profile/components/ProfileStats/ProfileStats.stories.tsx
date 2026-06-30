import type { Meta, StoryObj } from "@storybook/react";

import { ProfileStats } from "./ProfileStats";

const meta: Meta<typeof ProfileStats> = {
  title: "Features/Profile/ProfileStats",
  component: ProfileStats,
};

export default meta;

type Story = StoryObj<typeof ProfileStats>;

export const Default: Story = {
  args: {
    items: [
      { label: "Carros", value: 3 },
      { label: "Flagrados", value: 24 },
      { label: "Seguidores", value: 128 },
    ],
  },
};
