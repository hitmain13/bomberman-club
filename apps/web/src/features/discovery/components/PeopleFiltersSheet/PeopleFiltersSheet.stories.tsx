import type { Meta, StoryObj } from "@storybook/react";

import { PeopleFiltersSheet } from "./PeopleFiltersSheet";

const meta: Meta<typeof PeopleFiltersSheet> = {
  title: "Features/Discovery/PeopleFiltersSheet",
  component: PeopleFiltersSheet,
  args: {
    open: true,
    value: { city: "São Paulo - SP", sort: "RECENT", memberSince: "ALL" },
    onClose: () => undefined,
    onApply: () => undefined,
    onClear: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof PeopleFiltersSheet>;

export const Default: Story = {};
