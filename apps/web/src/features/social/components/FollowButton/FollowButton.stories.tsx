import type { Meta, StoryObj } from "@storybook/react";

import { FollowButton } from "./FollowButton";

const meta: Meta<typeof FollowButton> = {
  title: "Features/Social/FollowButton",
  component: FollowButton,
  args: { username: "speed.fabio" },
};

export default meta;

type Story = StoryObj<typeof FollowButton>;

export const Default: Story = {};
