import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getAuthorData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getAuthorData", () => {
  it("should call execute with the correct query and variables", async () => {
    const mockSlug = "test-author";
    const mockPreview = true;
    const mockResponse = {
      horizons_authorCollection: {
        items: [
          {
            name: "Test Author",
            bio: { json: {} },
            profilePicture: "https://example.com/profile.jpg",
          },
        ],
      },
      horizons_articleCollection: {
        items: [
          {
            title: "Test Article",
            slug: "test-article",
          },
        ],
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getAuthorData(mockSlug);

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
    const mockSlug = "non-existent-author";
    const mockResponse = {
      horizons_authorCollection: { items: [] },
      horizons_articleCollection: { items: [] },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getAuthorData(mockSlug);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockSlug = "test-author";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getAuthorData(mockSlug)).rejects.toThrow("GraphQL error");
  });
});
