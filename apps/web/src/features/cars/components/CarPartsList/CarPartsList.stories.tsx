import type { CarPartResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarPartsList } from "./CarPartsList";

const parts: ReadonlyArray<CarPartResponse> = [
  {
    id: "cp_1",
    installedAt: null,
    description: null,
    part: { id: "p_1", categoryId: "cat_1", manufacturer: "Garrett", name: "GTX2860" },
    category: { id: "cat_1", slug: "turbo", name: "Turbina" },
  },
  {
    id: "cp_2",
    installedAt: null,
    description: null,
    part: { id: "p_2", categoryId: "cat_2", manufacturer: "Forge", name: "FMIC 2.0" },
    category: { id: "cat_2", slug: "intercooler", name: "Intercooler" },
  },
];

const meta: Meta<typeof CarPartsList> = {
  title: "Features/Cars/CarPartsList",
  component: CarPartsList,
  args: { parts },
};

export default meta;

type Story = StoryObj<typeof CarPartsList>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
