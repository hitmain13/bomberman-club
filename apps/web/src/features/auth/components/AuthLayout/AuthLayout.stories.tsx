import type { Meta, StoryObj } from "@storybook/react";

import { AuthLayout } from "./AuthLayout";

const meta: Meta<typeof AuthLayout> = {
  title: "Features/Auth/AuthLayout",
  component: AuthLayout,
};

export default meta;

type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  args: {
    title: "Entrar",
    subtitle: "Comunidade para entusiastas de carros duvidosos.",
    children: <p style={{ color: "white" }}>Form aqui</p>,
  },
};
