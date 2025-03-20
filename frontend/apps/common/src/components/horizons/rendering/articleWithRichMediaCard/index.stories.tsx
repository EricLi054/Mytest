import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";
import { TestArticle } from "../../../../testing/data/testData";

const meta = {
  title: "common/Horizons/Components/ArticleWithRichMediaCard",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleWithRichMediaCard = {
  args: {
    article: TestArticle,
    showCategoryOnCard: true,
  },
} satisfies Story;
