import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getLinkList } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getLinkList", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "content-123";
    const mockResponse = {
      linkList: {
        title: "Explore by driving topics",
        slug: "explore-by-driving-topics",
        sectionColour: "blue",
        category: {
          name: "Drive",
          slug: "drive",
          colour: "Red",
        },
        heading: "Explore by driving topics",
        pagesCollection: {
          items: [
            {
              title: "Article 1",
              slug: "article-1",
              seoMetaTags: {
                openGraphImage: {
                  image: {
                    secure_url: "https://example.com/image.jpg",
                  },
                },
              },
            },
          ],
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getLinkList(mockId);

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
    const mockId = "invalid-id";
    const mockResponse = { featuredContent: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getLinkList(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getLinkList(mockId)).rejects.toThrow("GraphQL error");
  });
});
