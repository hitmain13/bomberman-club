import type { SpecValueResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarSpecsList } from "./CarSpecsList";

const specs: ReadonlyArray<SpecValueResponse> = [
  {
    id: "v_1",
    valueString: "Stage 3",
    valueNumber: null,
    valueBoolean: null,
    definition: {
      id: "d_1",
      key: "stage",
      name: "Stage",
      type: "ENUM",
      unit: null,
      category: "engine",
      enumOptions: ["Stage 1", "Stage 2", "Stage 3"],
    },
  },
  {
    id: "v_2",
    valueString: null,
    valueNumber: 1.4,
    valueBoolean: null,
    definition: {
      id: "d_2",
      key: "boost",
      name: "Pressão de turbo",
      type: "NUMBER",
      unit: "bar",
      category: "engine",
      enumOptions: null,
    },
  },
];

const meta: Meta<typeof CarSpecsList> = {
  title: "Features/Cars/CarSpecsList",
  component: CarSpecsList,
  args: { specs },
};

export default meta;

type Story = StoryObj<typeof CarSpecsList>;

export const Default: Story = {};
