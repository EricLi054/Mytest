import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";
import { TestArticle } from "../../../../testing/data/testData";

const meta = {
  title: "common/Horizons/Components/ArticleCard",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleCard = {
  args: {
    article: TestArticle,
    showCategoryOnCard: true,
    sectionColour: "White",
  },
} satisfies Story;
