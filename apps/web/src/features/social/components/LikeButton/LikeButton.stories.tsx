import type { Meta, StoryObj } from "@storybook/react";

import { LikeButton } from "./LikeButton";

const meta: Meta<typeof LikeButton> = {
  title: "Features/Social/LikeButton",
  component: LikeButton,
  args: { targetType: "SIGHTING", targetId: "s1", initialCount: 12 },
};

export default meta;

type Story = StoryObj<typeof LikeButton>;

export const Default: Story = {};
