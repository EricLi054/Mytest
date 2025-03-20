import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";

import Component from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/session-timeout",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SessionTimeout = {
  name: "session-timeout",
  args: {
    racHomepageUrl: EMPTY_URL,
    footerProps: {},
    gtmPageTitle: "SessionTimeout",
  },
} satisfies Story;
