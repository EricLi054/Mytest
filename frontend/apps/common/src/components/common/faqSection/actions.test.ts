import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getFaqSectionCollection } from "./actions";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

describe("getFaqSection", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "faq-id";
    const mockResponse = {
      data: {
        faqSection: {
          heading: "Test FAQ",
          questionUrls: {
            json: {
              nodeType: "document",
              data: {},
              content: [
                {
                  nodeType: "hr",
                  data: {},
                  content: [],
                },
                {
                  nodeType: "paragraph",
                  data: {},
                  content: [
                    {
                      nodeType: "text",
                      value: " ",
                      marks: [],
                      data: {},
                    },
                    {
                      nodeType: "hyperlink",
                      data: {
                        uri: "/faq/how-to-do-a",
                      },
                      content: [
                        {
                          nodeType: "text",
                          value: "How do I do A?",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                    {
                      nodeType: "text",
                      value: "",
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
                      value: "",
                      marks: [],
                      data: {},
                    },
                    {
                      nodeType: "hyperlink",
                      data: {
                        uri: "/faq/how-to-do-b",
                      },
                      content: [
                        {
                          nodeType: "text",
                          value: "How do I do B?",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                    {
                      nodeType: "text",
                      value: "",
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);

    const result = await getFaqSectionCollection(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockId = "empty-id";
    const mockResponse = {
      items: [],
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getFaqSectionCollection(mockId);

    expect(result).toEqual(mockResponse);
  });
});
