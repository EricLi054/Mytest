import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getArticlesFromTags } from "./getArticlesFromTags";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getArticlesFromTags", () => {
  const mockTagIds = ["tag-1", "tag-2"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with correct query and variables", async () => {
    const mockResponse = {
      articleCollection: {
        items: [
          {
            title: "Article 1",
            slug: "article-1",
            tileImage: {
              title: "Image Title",
              image: "image-url",
            },
            category: "News",
            lastUpdated: "2025-01-08T00:00:00.000Z",
            published: "2023-01-01T00:00:00.000Z",
            leadParagraph: "This is the lead paragraph.",
            renderTags: true,
            content: { json: {} },
            contentfulMetadata: {
              tags: [{ id: "tag-1", name: "Tag One" }],
            },
            sys: {
              publishedVersion: 1,
              publishedAt: "2024-06-12T12:00:00Z",
              firstPublishedAt: "2024-06-10T12:00:00Z",
            },
          },
        ],
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getArticlesFromTags(mockTagIds);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: true,
        tagIds: mockTagIds,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should handle errors when execute fails", async () => {
    const errorMessage = "GraphQL request failed";
    (execute as Mock).mockRejectedValue(new Error(errorMessage));

    await expect(getArticlesFromTags(mockTagIds)).rejects.toThrow(errorMessage);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: true,
        tagIds: mockTagIds,
      },
    });
  });
});
