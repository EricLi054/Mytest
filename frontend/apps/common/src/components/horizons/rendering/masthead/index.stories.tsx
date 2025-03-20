import type { Meta, StoryObj } from "@storybook/react";

import Component from "./navbar";

const meta = {
  title: "common/Horizons/Components/Navbar",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Navbar = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/test-pathname",
      },
    },
  },
  args: {
    categories: [
      {
        name: "Drive",
        slug: "drive",
        colour: "Red",
      },
      {
        name: "Explore",
        slug: "explore",
        colour: "Green",
      },
    ],
  },
} satisfies Story;
