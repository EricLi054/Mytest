import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getDropDownCollection } from "./data";

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
              contentCollection: {
                items: [
                  {
                    sys: { id: "content-id" },
                    __typename: "Entry",
                  },
                  {
                    sys: { id: "content-id2" },
                    __typename: "Entry2",
                  },
                ],
              },
            },
          ],
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);

    const result = await getDropDownCollection(mockSlug);

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

    const result = await getDropDownCollection(mockSlug);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockSlug = "error-slug";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getDropDownCollection(mockSlug)).rejects.toThrow("GraphQL error");
  });
});
