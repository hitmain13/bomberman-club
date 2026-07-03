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

export const FourColumns: Story = {
  args: {
    items: [
      { label: "Carros", value: 3 },
      { label: "Flagrados", value: 24 },
      { label: "Seguidores", value: 1200 },
      { label: "Seguindo", value: 320 },
    ],
  },
};

export const TwoColumns: Story = {
  args: {
    items: [
      { label: "Seguidores", value: 1200 },
      { label: "Seguindo", value: 320 },
    ],
  },
};
