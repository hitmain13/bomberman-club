import type { Meta, StoryObj } from "@storybook/react";

import { RecoverForm } from "./RecoverForm";

const meta: Meta<typeof RecoverForm> = {
  title: "Features/Auth/RecoverForm",
  component: RecoverForm,
};

export default meta;

type Story = StoryObj<typeof RecoverForm>;

export const Default: Story = {};
