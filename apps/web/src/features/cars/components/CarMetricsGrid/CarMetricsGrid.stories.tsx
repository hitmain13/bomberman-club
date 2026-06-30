import type { CarResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarMetricsGrid } from "./CarMetricsGrid";

const car: CarResponse = {
  id: "1",
  garageId: "g1",
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
  currentKm: 58_500,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta: Meta<typeof CarMetricsGrid> = {
  title: "Features/Cars/CarMetricsGrid",
  component: CarMetricsGrid,
  args: { car },
};

export default meta;

type Story = StoryObj<typeof CarMetricsGrid>;

export const Default: Story = {};
