import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getFaqSection } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getFaqSection", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "faq-id";
    const mockPreview = true;
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

    const result = await getFaqSection(mockId);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: mockPreview,
        id: mockId,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockId = "empty-id";
    const mockResponse = {
      items: [],
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getFaqSection(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getFaqSection(mockId)).rejects.toThrow("GraphQL error");
  });
});
