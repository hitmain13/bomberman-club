import type { Meta, StoryObj } from "@storybook/react";

import { LocationPicker } from "./LocationPicker";

const meta: Meta<typeof LocationPicker> = {
  title: "Features/Sightings/LocationPicker",
  component: LocationPicker,
  args: {
    open: true,
    initialLatitude: -23.55,
    initialLongitude: -46.63,
    onCancel: () => undefined,
    onConfirm: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof LocationPicker>;

export const Default: Story = {};
