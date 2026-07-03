import type { Meta, StoryObj } from "@storybook/react";

import { CarsFiltersSheet } from "./CarsFiltersSheet";

const meta: Meta<typeof CarsFiltersSheet> = {
  title: "Features/Discovery/CarsFiltersSheet",
  component: CarsFiltersSheet,
  args: {
    open: true,
    value: { stage: "", sort: "NEWEST" },
    onClose: () => undefined,
    onApply: () => undefined,
    onClear: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof CarsFiltersSheet>;

export const Default: Story = {};
