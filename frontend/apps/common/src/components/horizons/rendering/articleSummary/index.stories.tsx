import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/Article Summary",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleSummary = {} satisfies Story;
