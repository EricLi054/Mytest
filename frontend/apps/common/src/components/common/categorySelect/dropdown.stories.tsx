import type { Meta, StoryObj } from "@storybook/react";

import Component from "./dropDown";

const meta = {
  title: "common/Website/Components/Dropdown",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebsiteDropDown = {
  args: {
    items: [
      {
        sys: {
          id: "1111",
        },
        categoryName: "Test 1",
      },
      {
        sys: {
          id: "2222",
        },
        categoryName: "Test 2",
      },
    ],
  },
} satisfies Story;
