import type { Meta, StoryObj } from "@storybook/react";

import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = { args: { label: "Email", placeholder: "seu@email" } };
export const WithHelper: Story = {
  args: { label: "Senha", type: "password", helperText: "8+ caracteres com maiúscula e número." },
};
export const WithError: Story = {
  args: { label: "Email", errorMessage: "Email inválido." },
};
