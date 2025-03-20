import type { Meta, StoryObj } from "@storybook/react";
import { TestFAQ } from "#testing/data/websiteTestData";

import Component from "./faqSection";

const meta = {
  title: "common/Website/Components/FaqSection",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContactUsFAQ = {
  args: {
    faqs: { ...TestFAQ },
  },
} satisfies Story;
