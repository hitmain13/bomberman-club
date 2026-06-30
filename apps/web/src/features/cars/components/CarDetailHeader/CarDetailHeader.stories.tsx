import type { CarResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarDetailHeader } from "./CarDetailHeader";

const car: CarResponse = {
  id: "car_1",
  garageId: "garage_1",
  nickname: "GTI Mk7",
  brand: "Volkswagen",
  model: "Golf GTI",
  generation: "Mk7",
  year: 2018,
  fuel: "GASOLINE",
  engine: "EA888",
  weightKg: 1320,
  horsepowerHp: 320,
  torqueNm: 420,
  currentKm: 50_000,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta: Meta<typeof CarDetailHeader> = {
  title: "Features/Cars/CarDetailHeader",
  component: CarDetailHeader,
  args: { car, stageBadge: "Stage 3" },
};

export default meta;

type Story = StoryObj<typeof CarDetailHeader>;

export const Default: Story = {};
