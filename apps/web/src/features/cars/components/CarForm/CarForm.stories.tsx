import type { Meta, StoryObj } from "@storybook/react";

import { CarForm } from "./CarForm";

const meta: Meta<typeof CarForm> = {
  title: "Features/Cars/CarForm",
  component: CarForm,
  args: { garageId: "g_1", onSubmit: () => undefined },
};

export default meta;

type Story = StoryObj<typeof CarForm>;

export const Create: Story = {};
