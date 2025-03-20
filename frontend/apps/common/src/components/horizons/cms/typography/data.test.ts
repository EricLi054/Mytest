import type { ContentfulTypography } from "#types/horizons/typography";
import type { Mock } from "vitest";
import { BLOCKS } from "@contentful/rich-text-types";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getTypography } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getTypography", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "12345";
    const mockResponse: ContentfulTypography = {
      data: {
        horizons_typography: {
          title: "Test Typography",
          heading: "Test Heading",
          layoutSize: "Full width",
          leftContent: {
            json: {
              nodeType: BLOCKS.DOCUMENT,
              content: [],
              data: {},
            },
          },
          rightContent: {
            json: {
              nodeType: BLOCKS.DOCUMENT,
              content: [],
              data: {},
            },
          },
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getTypography(mockId);

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

    const result = await getTypography(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getTypography(mockId)).rejects.toThrow("GraphQL error");
  });
});
