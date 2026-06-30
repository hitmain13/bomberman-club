import type { Meta, StoryObj } from "@storybook/react";

import { AddCarPartForm } from "./AddCarPartForm";

const meta: Meta<typeof AddCarPartForm> = {
  title: "Features/Cars/AddCarPartForm",
  component: AddCarPartForm,
  args: { onSubmit: () => undefined },
};

export default meta;

type Story = StoryObj<typeof AddCarPartForm>;

export const Default: Story = {};
