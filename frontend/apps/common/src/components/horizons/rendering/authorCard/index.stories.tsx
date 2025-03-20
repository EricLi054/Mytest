import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "@mui/material";
import { TestAuthor } from "#testing/data/testData";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/Author Card",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuthorCard = {
  args: {
    author: {
      ...TestAuthor,
    },
    authorBio: <Typography>Author Bio</Typography>,
  },
} satisfies Story;
