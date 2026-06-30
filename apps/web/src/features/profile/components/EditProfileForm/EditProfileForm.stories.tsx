import type { PrivateUser } from "@bomberman/types";
import type { Meta, StoryObj } from "@storybook/react";

import { EditProfileForm } from "./EditProfileForm";

const baseUser: PrivateUser = {
  id: "1",
  username: "speed.fabio",
  email: "fabio@example.com",
  role: "USER",
  bio: "Apaixonado por turbo.",
  city: "São Paulo - SP",
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};

const meta: Meta<typeof EditProfileForm> = {
  title: "Features/Profile/EditProfileForm",
  component: EditProfileForm,
  args: { user: baseUser },
};

export default meta;

type Story = StoryObj<typeof EditProfileForm>;

export const Default: Story = {};
