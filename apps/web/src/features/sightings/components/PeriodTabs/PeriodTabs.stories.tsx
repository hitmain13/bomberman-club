import type { Meta, StoryObj } from "@storybook/react";

import { PeriodTabs } from "./PeriodTabs";

const meta: Meta<typeof PeriodTabs> = {
  title: "Features/Sightings/PeriodTabs",
  component: PeriodTabs,
  args: { value: "WEEK", onChange: () => undefined },
};

export default meta;

type Story = StoryObj<typeof PeriodTabs>;

export const Default: Story = {};
