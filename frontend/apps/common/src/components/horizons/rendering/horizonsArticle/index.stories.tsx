import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "@mui/material";

import Component from ".";
import { TestArticle } from "../../../../testing/data/testData";

const meta = {
  title: "common/Horizons/Components/HorizonsArticle",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HorizonsArticle = {
  args: {
    article: TestArticle,
    relatedArticles: [
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
    articleContent: <Typography>Article Content</Typography>,
    articleContentPlainText: "Article Content Plain Text",
  },
} satisfies Story;
