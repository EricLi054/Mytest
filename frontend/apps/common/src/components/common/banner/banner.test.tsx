import type { ComponentCollection } from "#types/common/banner";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContentfulRichTextRenderer from "../contentfulRichTextRenderer";
import WebsiteBanner from "./banner";

const mockWebsiteBanner: ComponentCollection = {
  heading: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "Test Heading",
              marks: [],
              data: {},
            },
          ],
        },
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
  bannerImage: [
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
      secure_url: "https://example.com/test_banner.jpg",
      original_url: "https://example.com/test_banner.jpg",
      resource_type: "image",
    },
  ],
  links: {
    items: [],
  },
};

describe("Banner", () => {
  it("should render the Banner image, heading and paragraph", () => {
    render(
      <WebsiteBanner
        bannerImage={mockWebsiteBanner.bannerImage[0]?.secure_url ?? ""}
        bannerText={<ContentfulRichTextRenderer text={mockWebsiteBanner.heading} />}
      />,
    );

    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Test Paragraph")).toBeInTheDocument();
    expect(screen.getByTestId("background")).toHaveStyle(
      `background-image: url(${mockWebsiteBanner.bannerImage[0]?.secure_url})`,
    );
  });
});
