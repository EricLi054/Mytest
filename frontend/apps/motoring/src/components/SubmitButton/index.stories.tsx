import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "motoring/Components/SubmitButton",
  component: Component,
  tags: ["@racwa/motoring"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubmitButton = {
  args: { children: "Submit" },
} satisfies Story;
