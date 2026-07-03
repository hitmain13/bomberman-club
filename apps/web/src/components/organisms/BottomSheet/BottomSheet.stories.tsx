import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/atoms/Button";

import { BottomSheet } from "./BottomSheet";

const meta: Meta<typeof BottomSheet> = {
  title: "Organisms/BottomSheet",
  component: BottomSheet,
  args: {
    open: true,
    title: "Filtros",
    onClose: () => undefined,
    children: <p style={{ color: "white" }}>Conteúdo do filtro aqui.</p>,
  },
};

export default meta;

type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {};

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="secondary" fullWidth>
          Limpar
        </Button>
        <Button fullWidth>Aplicar filtros</Button>
      </>
    ),
  },
};

export const Closed: Story = { args: { open: false } };
