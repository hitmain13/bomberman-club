import type { Meta, StoryObj } from "@storybook/react";

import { BottomNav } from "./BottomNav";

const meta: Meta<typeof BottomNav> = {
  title: "Organisms/BottomNav",
  component: BottomNav,
};

export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  args: {
    items: [
      { href: "/", label: "Início", icon: "home" },
      { href: "/explore", label: "Explorar", icon: "explore" },
      { href: "/new", label: "Novo", icon: "plus", emphasized: true },
      { href: "/map", label: "Mapa", icon: "map" },
      { href: "/me", label: "Perfil", icon: "user" },
    ],
  },
};
