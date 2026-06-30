import type { Meta, StoryObj } from "@storybook/react";

import { CommentsThread } from "./CommentsThread";

const meta: Meta<typeof CommentsThread> = {
  title: "Features/Social/CommentsThread",
  component: CommentsThread,
  args: { targetType: "SIGHTING", targetId: "s1", currentUserId: null },
};

export default meta;

type Story = StoryObj<typeof CommentsThread>;

export const Default: Story = {};
