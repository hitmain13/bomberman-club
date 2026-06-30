import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Display: Story = { args: { variant: "display", children: "Bomberman Club" } };
export const Title: Story = { args: { variant: "title", children: "GTI Mk7" } };
export const Body: Story = { args: { variant: "body", children: "Apaixonado por turbo." } };
export const Caption: Story = {
  args: { variant: "caption", tone: "muted", children: "São Paulo" },
};
export const Metric: Story = { args: { variant: "metric", children: "320 cv" } };
