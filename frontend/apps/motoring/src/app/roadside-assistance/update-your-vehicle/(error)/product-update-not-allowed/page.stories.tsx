import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";
import { mockUpdateNotAllowedContentfulData } from "#mocks/mockContentful";

import Component from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/product-update-not-allowed",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductUpdateNotAllowed = {
  name: "product-update-not-allowed",
  args: {
    racHomepageUrl: EMPTY_URL,
    footerProps: {},
    contentfulData: mockUpdateNotAllowedContentfulData,
  },
} satisfies Story;
