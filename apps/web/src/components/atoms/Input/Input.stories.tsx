import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Email" } };
export const Invalid: Story = { args: { placeholder: "Email", invalid: true } };
export const Password: Story = { args: { placeholder: "Senha", type: "password" } };
