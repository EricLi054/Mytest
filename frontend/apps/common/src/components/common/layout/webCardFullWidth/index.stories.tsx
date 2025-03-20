import type { Meta, StoryObj } from "@storybook/react";
import { BLOCKS } from "@contentful/rich-text-types";

import Component from ".";

const meta = {
  title: "common/Website/Components/Layout/WebCardFullWidth",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebCardFullWidth = {
  args: {
    webCards: {
      items: [
        {
          sys: {
            id: "12345",
          },
          title: "Card Title Full Width",
          image: [
            {
              url: "https://example.com",
              tags: [],
              context: {
                custom: {
                  alt: "",
                  caption: "",
                },
              },
              type: "upload",
              bytes: 84544,
              width: 1920,
              format: "jpg",
              height: 450,
              version: 1735799581,
              duration: 0,
              metadata: {},
              public_id: "test_banner",
              created_at: "2025-01-02T06:33:01Z",
              secure_url: "https://example.com/test_icon.jpg",
              original_url: "https://example.com/test_icon.jpg",
              resource_type: "image",
            },
          ],
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
      ],
    },
  },
} satisfies Story;
