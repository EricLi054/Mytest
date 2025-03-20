import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getFilterableContent } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getFilterableContent", () => {
  const mockId = "test-id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with correct query and variables", async () => {
    const mockResponse = {
      filterableContent: {
        title: "Test Title",
        slug: "test-slug",
        sectionColour: "blue",
        category: "test-category",
        heading: "Test Heading",
        showTagFilters: true,
        contentfulMetadata: {
          tags: [{ id: "tag-1", name: "Tag One" }],
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getFilterableContent(mockId);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: true,
        id: mockId,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should handle errors when execute fails", async () => {
    const errorMessage = "GraphQL request failed";
    (execute as Mock).mockRejectedValue(new Error(errorMessage));

    await expect(getFilterableContent(mockId)).rejects.toThrow(errorMessage);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: {
        preview: true,
        id: mockId,
      },
    });
  });
});
