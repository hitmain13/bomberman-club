import type { CarResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarCard } from "./CarCard";

const baseCar: CarResponse = {
  id: "car_1",
  garageId: "garage_1",
  nickname: "GTI Mk7",
  brand: "Volkswagen",
  model: "Golf GTI",
  generation: "Mk7",
  year: 2018,
  fuel: "GASOLINE",
  engine: "EA888 2.0 TSI",
  weightKg: 1320,
  horsepowerHp: 320,
  torqueNm: 420,
  currentKm: 58_500,
  plate: null,
  coverUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta: Meta<typeof CarCard> = {
  title: "Features/Garage/CarCard",
  component: CarCard,
  args: { car: baseCar },
};

export default meta;

type Story = StoryObj<typeof CarCard>;

export const Default: Story = {};
export const HighPower: Story = {
  args: {
    car: { ...baseCar, nickname: "Civic Si", horsepowerHp: 450, weightKg: 1280, torqueNm: 550 },
  },
};
