import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "motoring/Components/BackButton",
  component: Component,
  tags: ["@racwa/motoring"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackButton = {} satisfies Story;
