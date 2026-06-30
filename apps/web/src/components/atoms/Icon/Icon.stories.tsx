import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const HomeIcon: Story = { args: { name: "home", size: "lg" } };
export const PlusIcon: Story = { args: { name: "plus", size: "lg" } };
export const MapIcon: Story = { args: { name: "map", size: "lg" } };
export const UserIcon: Story = { args: { name: "user", size: "lg" } };
