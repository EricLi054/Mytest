import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";

import Component from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/system-unavailable",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemUnavailable = {
  name: "system-unavailable",
  args: {
    racHomePageUrl: EMPTY_URL,
    footerProps: {},
  },
} satisfies Story;
