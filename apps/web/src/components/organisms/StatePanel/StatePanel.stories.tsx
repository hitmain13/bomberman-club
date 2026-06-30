import type { Meta, StoryObj } from "@storybook/react";

import { StatePanel } from "./StatePanel";

const meta: Meta<typeof StatePanel> = {
  title: "Organisms/StatePanel",
  component: StatePanel,
};

export default meta;

type Story = StoryObj<typeof StatePanel>;

export const LoadingState: Story = { args: { kind: "loading" } };
export const EmptyState: Story = {
  args: { kind: "empty", title: "Nenhum carro ainda.", description: "Adicione seu primeiro." },
};
export const ErrorState: Story = {
  args: { kind: "error", description: "Tente novamente em alguns instantes." },
};
