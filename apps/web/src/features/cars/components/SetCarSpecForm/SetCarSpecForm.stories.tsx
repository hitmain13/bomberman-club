import type { Meta, StoryObj } from "@storybook/react";

import { SetCarSpecForm } from "./SetCarSpecForm";

const meta: Meta<typeof SetCarSpecForm> = {
  title: "Features/Cars/SetCarSpecForm",
  component: SetCarSpecForm,
  args: {
    onSubmit: () => undefined,
    definitions: [
      {
        id: "d_1",
        key: "stage",
        name: "Stage",
        type: "ENUM",
        unit: null,
        category: "engine",
        enumOptions: ["Stock", "Stage 1", "Stage 2", "Stage 3"],
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof SetCarSpecForm>;

export const Default: Story = {};
