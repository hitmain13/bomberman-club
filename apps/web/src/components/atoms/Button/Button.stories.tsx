import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Entrar" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancelar" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Sair" } };
export const Danger: Story = { args: { variant: "danger", children: "Excluir" } };
export const Loading: Story = { args: { isLoading: true, children: "Salvar" } };
export const FullWidth: Story = { args: { fullWidth: true, children: "Continuar" } };
