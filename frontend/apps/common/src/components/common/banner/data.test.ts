import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getBanner } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getBanner", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "12345";
    const mockPreview = true;
    const mockResponse = {
      rac_banner: {
        heading: {
          json: { nodeType: "document", content: [] },
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
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getBanner(mockId);

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
    const mockId = "0222";
    const mockResponse = {
      banner: null,
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getBanner(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "123";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getBanner(mockId)).rejects.toThrow("GraphQL error");
  });
});
