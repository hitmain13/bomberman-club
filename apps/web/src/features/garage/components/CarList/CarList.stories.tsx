import type { CarResponse } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { CarList } from "./CarList";

const baseCar: CarResponse = {
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

const meta: Meta<typeof CarList> = {
  title: "Features/Garage/CarList",
  component: CarList,
};

export default meta;

type Story = StoryObj<typeof CarList>;

export const Default: Story = {
  args: {
    cars: [
      baseCar,
      { ...baseCar, id: "2", nickname: "Civic Si", horsepowerHp: 280, weightKg: 1290 },
    ],
  },
};
