import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getWebsitePage } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getWebsitePage", () => {
  it("should call execute with correct query and variables", async () => {
    const mockSlug = "sample-slug";
    const mockPreview = true;
    const mockResponse = {
      data: {
        rac_basePageCollection: {
          items: [
            {
              slug: "dynamic-content-slug",
              nameOfInstance: "Dynamic Base Page Title",
              banner: {
                __typename: "Banner",
                sys: { id: "banner-Id" },
              },
              seoMetaTags: {
                title: "Test SEO",
                description: "Test SEO Description",
                keywords: null,
                image: null,
              },
              contentCollection: {
                items: [
                  {
                    sys: { id: "content-id" },
                    __typename: "Entry",
                  },
                ],
              },
            },
          ],
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);

    const result = await getWebsitePage(mockSlug);

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
      items: [],
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getWebsitePage(mockSlug);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockSlug = "error-slug";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getWebsitePage(mockSlug)).rejects.toThrow("GraphQL error");
  });
});
