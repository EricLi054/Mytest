import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#utils/constants";

import Component from "./container";

const meta = {
  title: "Identity/Error Pages/Session Timeout",
  component: Component,
  args: {
    racHomePageUrl: EMPTY_URL,
  },
  tags: ["@racwa/identity"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SessionTimeout = {} satisfies Story;
