import type { Meta, StoryObj } from "@storybook/react";
import { getMockFooterProps } from "#testing/mockData";
import { EMPTY_URL } from "#utils/constants";

import Component from "./container";

const meta = {
  title: "Identity/Error Pages/System Unavailable",
  component: Component,
  tags: ["@racwa/identity"],
  args: {
    racHomePageUrl: EMPTY_URL,
    footerProps: getMockFooterProps(),
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemUnavailable = {} satisfies Story;
