import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";
import { mockChangeAlreadyMadeContentfulData } from "#mocks/contentful";

import Component from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/change-already-made",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChangeAlreadyMade = {
  name: "change-already-made",
  args: {
    racHomepageUrl: EMPTY_URL,
    footerProps: {},
    contentfulData: mockChangeAlreadyMadeContentfulData,
  },
} satisfies Story;
