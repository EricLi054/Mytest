import type { WebCardDetails } from "#types/common/webCardWrapper";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WebCard from ".";

const mockWebCardDetails: WebCardDetails = {
  sys: {
    id: "12345",
  },
  title: "Card Title",
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
};

describe("Get Web Card Full", () => {
  it("should render the Web Card Full", () => {
    render(<WebCard webCardDetails={mockWebCardDetails} />);

    expect(screen.getByText("Card Title")).toBeVisible();
  });
});
