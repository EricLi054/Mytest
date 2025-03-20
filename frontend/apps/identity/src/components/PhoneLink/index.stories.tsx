import type { Meta, StoryObj } from "@storybook/react";

import PhoneLink from ".";

const meta = {
  title: "Identity/Components/Phone Number Link",
  component: PhoneLink,
  args: { displayNumber: "13 17 03" },
  tags: ["@racwa/Identity"],
} satisfies Meta<typeof PhoneLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PhoneNumberLink = {} satisfies Story;
