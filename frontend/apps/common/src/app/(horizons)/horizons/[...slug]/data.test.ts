import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getPageData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getPageData", () => {
  it("should call execute with correct query and variables", async () => {
    const mockSlug = "sample-slug";
    const mockPreview = true;
    const mockResponse = {
      articleCollection: {
        items: [
          {
            title: "Sample Article",
            slug: "sample-slug",
            seoMetaTags: {
              title: "SEO Title",
              description: "SEO Description",
              openGraphTitle: "Open Graph Title",
              openGraphDescription: "Open Graph Description",
              openGraphImage: {
                title: "OG Image Title",
                image: "https://example.com/image.jpg",
                showCaption: true,
                link: "",
                openLinkInNewTab: false,
                fillContainerWidth: true,
              },
              openGraphSiteName: "Site Name",
              openGraphUrl: "https://example.com",
              allowSearchEngineIndexing: true,
              allowSearchEngineFollowing: true,
            },
            redirectUrl: "",
            bannerImage: {
              title: "Banner Image Title",
              image: "https://example.com/banner.jpg",
              showCaption: true,
              link: "",
              openLinkInNewTab: false,
              fillContainerWidth: true,
            },
            tileImage: {
              title: "Tile Image Title",
              image: "https://example.com/tile.jpg",
              showCaption: true,
              link: "",
              openLinkInNewTab: false,
              fillContainerWidth: true,
            },
            category: "Category Name",
            lastUpdated: "2025-01-08T00:00:00.000Z",
            published: "2023-01-01T00:00:00.000Z",
            leadParagraph: "This is the lead paragraph.",
            renderTags: true,
            content: {
              json: {},
              links: {
                entries: [
                  {
                    inline: {
                      __typename: "Entry",
                      sys: {
                        id: "content-id",
                      },
                    },
                  },
                ],
              },
            },
            author: {
              name: "Author Name",
              slug: "author-slug",
              bio: { json: {} },
              profilePicture: "https://example.com/profile.jpg",
            },
            relatedArticlesCollection: {
              items: [{ sys: { id: "related-article-id", __typename: "Article" } }],
            },
            contentfulMetadata: {
              tags: [{ id: "tag-id", name: "Tag Name" }],
            },
            sys: {
              publishedVersion: 1,
              publishedAt: "2024-12-01T00:00:00Z",
              firstPublishedAt: "2024-12-01T00:00:00Z",
            },
          },
        ],
      },
      pageCollection: {
        items: [
          {
            title: "Dynamic Content Title",
            slug: "dynamic-content-slug",
            seoMetaTags: {
              title: "SEO Title",
              description: "SEO Description",
              openGraphTitle: "Open Graph Title",
              openGraphDescription: "Open Graph Description",
              openGraphImage: {
                title: "OG Image Title",
                image: "https://example.com/image.jpg",
                showCaption: true,
                link: "",
                openLinkInNewTab: false,
                fillContainerWidth: true,
              },
              openGraphSiteName: "Site Name",
              openGraphUrl: "https://example.com",
              allowSearchEngineIndexing: true,
              allowSearchEngineFollowing: true,
            },
            contentCollection: {
              items: [
                {
                  sys: { id: "content-id" },
                  __typename: "Entry",
                },
              ],
            },
            contentfulMetadata: {
              tags: [{ id: "tag-id", name: "Tag Name" }],
            },
          },
        ],
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getPageData(mockSlug);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: mockPreview,
        slug: mockSlug,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockSlug = "empty-slug";
    const mockResponse = {
      articleCollection: { items: [] },
      pageCollection: { items: [] },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getPageData(mockSlug);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockSlug = "error-slug";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getPageData(mockSlug)).rejects.toThrow("GraphQL error");
  });
});
