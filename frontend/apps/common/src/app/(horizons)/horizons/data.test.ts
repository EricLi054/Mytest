import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getHomePageData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getPageData", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockResponse = {
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

    const result = await getHomePageData();

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: mockPreview,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockResponse = {
      articleCollection: { items: [] },
      pageCollection: { items: [] },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getHomePageData();

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getHomePageData()).rejects.toThrow("GraphQL error");
  });
});
