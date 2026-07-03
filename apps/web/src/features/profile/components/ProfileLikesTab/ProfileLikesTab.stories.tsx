import type { Meta, StoryObj } from "@storybook/react";

import { ProfileLikesTab } from "./ProfileLikesTab";

const meta: Meta<typeof ProfileLikesTab> = {
  title: "Features/Profile/ProfileLikesTab",
  component: ProfileLikesTab,
  args: { username: "speed.fabio" },
};

export default meta;

type Story = StoryObj<typeof ProfileLikesTab>;

export const Default: Story = {};
