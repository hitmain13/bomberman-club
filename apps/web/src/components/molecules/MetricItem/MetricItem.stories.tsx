import type { Meta, StoryObj } from "@storybook/react";

import { MetricItem } from "./MetricItem";

const meta: Meta<typeof MetricItem> = {
  title: "Molecules/MetricItem",
  component: MetricItem,
};

export default meta;

type Story = StoryObj<typeof MetricItem>;

export const Power: Story = { args: { label: "Potência", value: "320", unit: "cv" } };
export const Weight: Story = { args: { label: "Peso", value: "1320", unit: "kg" } };
export const Ratio: Story = { args: { label: "Peso/Potência", value: "4.04", unit: "kg/cv" } };
