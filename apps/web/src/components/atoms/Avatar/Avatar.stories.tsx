import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = { args: { src: null, alt: "Fabio Rodrigues", size: "lg" } };
export const Small: Story = { args: { src: null, alt: "Caio", size: "sm" } };
export const ExtraLarge: Story = { args: { src: null, alt: "Speed Fabio", size: "xl" } };
