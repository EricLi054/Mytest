import type { Meta, StoryObj } from "@storybook/react";
import { TestArticle } from "#testing/data/testData";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/Author Latest Articles",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuthorLatestArticles = {
  args: {
    articles: [
      {
        ...TestArticle,
      },
      {
        ...TestArticle,
      },
      {
        ...TestArticle,
      },
    ],
  },
} satisfies Story;
