import type { Meta, StoryObj } from "@storybook/react";

import { ProfileTabs } from "./ProfileTabs";

const meta: Meta<typeof ProfileTabs> = {
  title: "Features/Profile/ProfileTabs",
  component: ProfileTabs,
};

export default meta;

type Story = StoryObj<typeof ProfileTabs>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "cars", label: "Carros", content: <p style={{ color: "white" }}>3 carros</p> },
      {
        id: "sightings",
        label: "Flagrados",
        content: <p style={{ color: "white" }}>12 flagrados</p>,
      },
      { id: "gallery", label: "Galeria", content: <p style={{ color: "white" }}>40 fotos</p> },
    ],
  },
};
