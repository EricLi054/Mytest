import type { Meta, StoryObj } from "@storybook/react";
import { BLOCKS } from "@contentful/rich-text-types";

import Component from ".";

const meta = {
  title: "common/Website/Components/WebCard",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebCard = {
  args: {
    webCardDetails: {
      sys: {
        id: "12345",
      },
      title: "Card Title Full Width",
      image: [],
      showRibbon: true,
      ribbonText: "Test Ribbon",
      content: {
        json: {
          nodeType: BLOCKS.DOCUMENT,
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: "text",
                  value: "Test Paragraph",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
          data: {},
        },
      },
      extraInfoHeader: null,
      extraInfo: null,
      buttonText: "Test Button ",
      buttonLink: "/test",
    },
  },
} satisfies Story;
