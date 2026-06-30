import type { Meta, StoryObj } from "@storybook/react";

import { FeedTabs } from "./FeedTabs";

const meta: Meta<typeof FeedTabs> = {
  title: "Features/Discovery/FeedTabs",
  component: FeedTabs,
  args: { value: "RECENT", onChange: () => undefined },
};

export default meta;

type Story = StoryObj<typeof FeedTabs>;

export const Default: Story = {};
