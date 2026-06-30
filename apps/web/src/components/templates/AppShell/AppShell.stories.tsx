import type { Meta, StoryObj } from "@storybook/react";

import { AppShell } from "./AppShell";

const meta: Meta<typeof AppShell> = {
  title: "Templates/AppShell",
  component: AppShell,
};

export default meta;

type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  args: { children: <p style={{ color: "white" }}>Conteúdo do app</p> },
};
export const NoBottomNav: Story = {
  args: { children: <p style={{ color: "white" }}>Onboarding</p>, hideBottomNav: true },
};
