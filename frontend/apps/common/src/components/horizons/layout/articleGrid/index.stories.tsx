import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";
import { TestArticle } from "../../../../testing/data/testData";

const meta = {
  title: "common/Horizons/Components/Article Grid",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleGrid = {
  args: {
    category: {
      name: "Drive",
      slug: "drive",
      colour: "Red",
    },
    heading: "Trending",
    articles: [TestArticle],
    cardType: "Article with Rich Media",
    showCategoryOnCard: true,
    sectionColour: "White",
  },
} satisfies Story;
