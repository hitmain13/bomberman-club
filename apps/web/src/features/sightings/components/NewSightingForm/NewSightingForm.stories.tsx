import type { Meta, StoryObj } from "@storybook/react";

import { NewSightingForm } from "./NewSightingForm";

const meta: Meta<typeof NewSightingForm> = {
  title: "Features/Sightings/NewSightingForm",
  component: NewSightingForm,
  args: { onSubmit: () => undefined },
};

export default meta;

type Story = StoryObj<typeof NewSightingForm>;

export const Default: Story = {};
