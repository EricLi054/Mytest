import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Banner from ".";

// Mock data and utilities
vi.mock("./data", () => ({
  getBanner: vi.fn(() => ({
    data: {
      rac_banner: {
        heading: {
          json: {
            nodeType: "document",
            content: [
              {
                nodeType: "heading-1",
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
                nodeType: "paragraph",
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
          },
          links: {
            entries: {
              inline: [],
            },
          },
        },
        bannerImage: [
          {
            url: "https://example.com",
            type: "upload",
            bytes: 84544,
            width: 1920,
            format: "jpg",
            height: 450,
            version: 1735799581,
            duration: null,
            metadata: {},
            public_id: "test_banner",
            created_at: "2025-01-02T06:33:01Z",
            secure_url: "https://example.com/test_banner.jpg",
            original_url: "https://example.com/test_banner.jpg",
            resource_type: "image",
            raw_transformation: "f_auto/q_auto",
            original_secure_url: "https://example.com/test_banner.jpg",
          },
        ],
        links: {
          items: [],
        },
      },
    },
  })),
}));

describe("Banner", () => {
  it("should render the Banner", async () => {
    const page = await Banner({ data: { sys: { id: "1234" } } });
    render(page);

    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Test Paragraph")).toBeInTheDocument();
  });
});
