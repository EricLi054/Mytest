import type { Meta, StoryObj } from "@storybook/react";

import Component from "./banner";

const meta = {
  title: "common/Website/Components/WebsiteBanner",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebsiteBanner = {
  args: {
    bannerImage: "http://res.rac.com.au/image/upload/f_auto/q_auto/v1735799581/Website/rac_consultant_banner.jpg",
    bannerText: "Test Banner text",
  },
} satisfies Story;
