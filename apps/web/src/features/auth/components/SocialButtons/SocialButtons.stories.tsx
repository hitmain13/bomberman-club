import type { Meta, StoryObj } from "@storybook/react";

import { SocialButtons } from "./SocialButtons";

const meta: Meta<typeof SocialButtons> = {
  title: "Features/Auth/SocialButtons",
  component: SocialButtons,
};

export default meta;

type Story = StoryObj<typeof SocialButtons>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
