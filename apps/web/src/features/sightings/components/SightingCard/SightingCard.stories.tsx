import type { SightingResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { SightingCard } from "./SightingCard";

const sighting: SightingResponse = {
  id: "s_1",
  userId: "u_1",
  author: { id: "u_1", username: "speed.fabio", avatarUrl: null },
  uploadId: "up_1",
  imageUrl: "https://placehold.co/600x400",
  title: "Flagrado no encontro noturno",
  description: "Vista incrível com tanto carro novo.",
  latitude: -23.55,
  longitude: -46.63,
  occurredAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const meta: Meta<typeof SightingCard> = {
  title: "Features/Sightings/SightingCard",
  component: SightingCard,
  args: { sighting },
};

export default meta;

type Story = StoryObj<typeof SightingCard>;

export const Default: Story = {};
