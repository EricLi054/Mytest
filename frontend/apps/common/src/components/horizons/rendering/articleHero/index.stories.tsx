import type { Meta, StoryObj } from "@storybook/react";
import { TestAuthor } from "#testing/data/testData";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/ArticleHero",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleHero = {
  args: {
    heading: "Heading",
    alt: "Image alt text",
    heroImage:
      "https://res.rac.com.au/rac-horizons/image/upload/v1740020666/Banner%20media/hybrids-explained-b_ddmmtb.jpg",
    leadParagraph: "Lead paragraph",
    readingTime: "1 min read",
    author: TestAuthor,
    plainTextPageContent: "Test Page Content",
    published: "2021-10-01T00:00:00.000Z",
    lastUpdated: "2021-10-01T00:00:00.000Z",
    renderTags: true,
    category: {
      name: "Drive",
      slug: "drive",
      colour: "Red",
    },
  },
} satisfies Story;
