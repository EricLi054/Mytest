import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getPageHeader } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getPageHeader", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "promo-banner-123";
    const mockResponse = {
      horizons_pageHeader: {
        title: "Sample Promo",
        image: {
          title: "Image Title",
          image: "image-url",
        },
        sectionColour: "blue",
        parentBreadcrumb: "Parent Breadcrumb",
        leftContent: { json: {} },
        rightContent: {
          json: {},
          links: {
            entries: {
              inline: [{ __typename: "TypeA", sys: { id: "inline-1" } }],
              block: [{ __typename: "TypeB", sys: { id: "block-1" } }],
            },
          },
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getPageHeader(mockId);

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
    const mockResponse = { pageHeader: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getPageHeader(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getPageHeader(mockId)).rejects.toThrow("GraphQL error");
  });
});
