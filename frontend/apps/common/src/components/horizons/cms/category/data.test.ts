import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCategories } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getCategories", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockResponse = {
      horizons_categoryCollection: {
        items: [
          { name: "Category 1", slug: "category-1", colour: "red", position: 1 },
          { name: "Category 2", slug: "category-2", colour: "blue", position: 2 },
        ],
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCategories();

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

  it("should handle an empty category collection gracefully", async () => {
    const mockResponse = { horizons_categoryCollection: { items: [] } };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCategories();

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getCategories()).rejects.toThrow("GraphQL error");
  });
});
