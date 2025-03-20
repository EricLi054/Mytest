import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta = {
  title: "common/Website/Components/Layout/GetInTouchGrid",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GetInTouchGrid = {
  args: {
    heading: "Test Get in Touch Heading",
    contactNumbers: {
      items: [
        {
          businessAreaCovered: "General",
          phoneNumber: "0412345678",
          openingHours: "Test hours",
          additionalOpeningHours: "Test Additional",
        },
      ],
    },
  },
} satisfies Story;
