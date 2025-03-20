import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "common/Horizons/Components/ListenToArticle",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListenToArticle = {
  args: {
    plainTextPageContent:
      "This is some sample page content. Clicking on the headphones icon will play the audio. The language can be set within the component. By default, english American is the best language to use simply because it is able to punctuate correctly.",
  },
} satisfies Story;
