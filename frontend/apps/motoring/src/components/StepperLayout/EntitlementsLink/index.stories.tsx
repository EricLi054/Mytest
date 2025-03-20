import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";

import Component from ".";

const meta = {
  title: "motoring/Components/StepperLayout/EntitlementsLink",
  component: Component,
  tags: ["@racwa/motoring"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntitlementsLink = {
  args: {
    url: EMPTY_URL,
  },
} satisfies Story;
