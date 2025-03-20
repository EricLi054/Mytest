import type { Meta, StoryObj } from "@storybook/react";
import { TestAuthor } from "#testing/data/testData";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/ArticleContentStickyBox",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleContentStickyBox = {
  args: {
    plainTextPageContent:
      "This is some sample page content. The sticky box will stick to the top of the page when the user scrolls past it. The sticky box will unstick when the user scrolls back up.",
    author: TestAuthor,
    published: "2021-10-01T00:00:00.000Z",
    lastUpdated: "2021-10-01T00:00:00.000Z",
  },
} satisfies Story;
