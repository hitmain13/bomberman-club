import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { children: "Stage 3" } };
export const Primary: Story = { args: { variant: "primary", children: "Em destaque" } };
export const Success: Story = { args: { variant: "success", children: "320 cv" } };
export const Warning: Story = { args: { variant: "warning", children: "Stage 2" } };
export const Danger: Story = { args: { variant: "danger", children: "Erro" } };
