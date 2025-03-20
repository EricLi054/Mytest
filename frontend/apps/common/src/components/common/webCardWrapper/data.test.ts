import type { Query } from "@testing-library/react";
import type { Mock } from "vitest";
import { serverEnv } from "#env/server.js";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getWebCardWrapper } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getWebCardWrapper", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "12345";
    const mockPreview = true;
    const mockResponse = {
      webCardWrapper: {
        heading: "Test Cards",
        rendering: "Grid",
        webCardsCollection: {
          items: [
            {
              sys: {
                id: "12345",
              },
              title: "Card Title",
              image: [
                {
                  url: "https://example.com/test_icon.svg",
                  tags: [],
                  type: "upload",
                  bytes: 3117,
                  width: 108,
                  format: "svg",
                  height: 108,
                  version: 1736908046,
                  duration: null,
                  metadata: {},
                  public_id: "test_icon",
                  created_at: "2025-01-15T02:27:26Z",
                  secure_url: "https://example.com/test_icon.svg",
                  original_url: "https://example.com/test_icon.svg",
                  resource_type: "image",
                  raw_transformation: "f_auto/q_auto",
                  original_secure_url: "https://example.com/test_icon.svg",
                },
              ],
              showRibbon: true,
              ribbonText: "Test Ribbon",
              content: {
                json: {
                  nodeType: "document",
                  data: {},
                  content: [
                    {
                      nodeType: "paragraph",
                      data: {},
                      content: [
                        {
                          nodeType: "text",
                          value: "Test paragraph",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
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
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getWebCardWrapper(mockId);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: GRAPHQL_ENDPOINT,
        sourceSystem: "common",
        query: expect.anything() as Query,
        variables: {
          preview: mockPreview,
          id: mockId,
        },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockId = "0222";
    const mockResponse = {
      webCardWrapper: null,
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getWebCardWrapper(mockId);

    expect(result).toEqual(mockResponse);
  });
});
