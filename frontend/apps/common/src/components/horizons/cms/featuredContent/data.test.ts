import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getFeaturedContent } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getFeaturedContent", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "content-123";
    const mockResponse = {
      featuredContent: {
        title: "Featured Title",
        slug: "featured-title",
        sectionColour: "blue",
        category: "news",
        cardType: "default",
        rendering: "card",
        showCategoryOnCard: true,
        articlesCollection: {
          items: [
            {
              title: "Article 1",
              slug: "article-1",
              tileImage: {
                title: "Image Title",
                image: "image-url",
              },
              category: "news",
              leadParagraph: "This is a lead paragraph.",
              content: {
                json: {},
              },
            },
          ],
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getFeaturedContent(mockId);

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

    const result = await getFeaturedContent(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getFeaturedContent(mockId)).rejects.toThrow("GraphQL error");
  });
});
