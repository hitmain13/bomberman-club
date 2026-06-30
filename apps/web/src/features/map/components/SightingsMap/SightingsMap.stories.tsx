import type { Meta, StoryObj } from "@storybook/react";

import { SightingsMap } from "./SightingsMap";

const meta: Meta<typeof SightingsMap> = {
  title: "Features/Map/SightingsMap",
  component: SightingsMap,
  args: { sightings: [] },
};

export default meta;

type Story = StoryObj<typeof SightingsMap>;

export const Empty: Story = {};
