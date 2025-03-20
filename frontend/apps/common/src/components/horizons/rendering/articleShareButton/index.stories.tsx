import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/ArticleShareButton",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleShareButton = {
  args: {
    heading: "This is an article heading",
    leadParagraph: "This is an article lead paragraph",
  },
} satisfies Story;
