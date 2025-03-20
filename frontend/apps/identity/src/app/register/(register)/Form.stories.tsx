import type { Meta, StoryObj } from "@storybook/react";
import { mockFormAction } from "#testing";

import RegisterForm from "./Form";

const meta: Meta<typeof RegisterForm> = {
  title: "Identity/Forms/Before You Start",
  args: { formAction: mockFormAction },
  component: RegisterForm,
  tags: ["@racwa/identity"],
};

export default meta;

type Story = StoryObj<typeof RegisterForm>;

export const BeforeYouStart: Story = {};
