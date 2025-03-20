import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "@mui/material";
import { TestBio } from "#testing/data/testData";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/Article Content",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleContent = {
  args: {
    content: <Typography>Article Content</Typography>,
    author: { name: "Author Name", profilePicture: [], bio: { ...TestBio } },
    plainTextPageContent: "This is some sample page content",
    published: "2021-10-01T00:00:00.000Z",
    lastUpdated: "2021-10-01T00:00:00.000Z",
    showArticleSummary: true,
  },
} satisfies Story;
