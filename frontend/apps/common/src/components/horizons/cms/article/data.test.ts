import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getArticle } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getArticle", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "12345";
    const mockResponse = {
      article: {
        title: "Sample Article",
        slug: "sample-article",
        category: "technology",
        tileImage: {
          title: "Sample Image Title",
          image: "sample.jpg",
        },
        content: {
          json: { nodeType: "document", content: [] },
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getArticle(mockId);

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
    const mockResponse = { article: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getArticle(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getArticle(mockId)).rejects.toThrow("GraphQL error");
  });
});
