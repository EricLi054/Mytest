import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "motoring/Components/LoadingModal",
  component: Component,
  tags: ["@racwa/motoring"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingModal = {
  args: {
    open: true,
    message: "Loading...",
  },
} satisfies Story;
