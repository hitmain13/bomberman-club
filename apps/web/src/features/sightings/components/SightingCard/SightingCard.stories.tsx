import type { Meta, StoryObj } from "@storybook/react";

import { sightingResponseFixture } from "../../testing/sighting-fixture";

import { SightingCard } from "./SightingCard";

const sighting = sightingResponseFixture({
  imageUrl: "https://placehold.co/600x400",
  title: "Flagrado no encontro noturno",
  description: "Vista incrível com tanto carro novo.",
});

const meta: Meta<typeof SightingCard> = {
  title: "Features/Sightings/SightingCard",
  component: SightingCard,
  args: { sighting },
};

export default meta;

type Story = StoryObj<typeof SightingCard>;

export const Default: Story = {};
