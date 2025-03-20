import type { Meta, StoryObj } from "@storybook/react";

import { PhoneLink } from ".";

const meta = {
  title: "mfa/Components/Phone Link",
  tags: ["@racwa/mfa"],
  component: PhoneLink,
  args: { displayNumber: "13 17 03" },
} satisfies Meta<typeof PhoneLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = { name: "Phone Link" } satisfies Story;
