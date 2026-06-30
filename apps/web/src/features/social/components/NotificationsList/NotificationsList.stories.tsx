import type { NotificationResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { NotificationsList } from "./NotificationsList";

const items: ReadonlyArray<NotificationResponse> = [
  {
    id: "n1",
    type: "LIKE",
    actorId: "u1",
    actorUsername: "vinte.dois",
    actorAvatarUrl: null,
    targetType: "SIGHTING",
    targetId: "s1",
    readAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n2",
    type: "FOLLOW",
    actorId: "u2",
    actorUsername: "turbo.gil",
    actorAvatarUrl: null,
    targetType: "PROFILE",
    targetId: "u_me",
    readAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const meta: Meta<typeof NotificationsList> = {
  title: "Features/Social/NotificationsList",
  component: NotificationsList,
  args: { notifications: items },
};

export default meta;

type Story = StoryObj<typeof NotificationsList>;

export const Default: Story = {};
