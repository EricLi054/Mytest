import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCategorySelectCollection } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getCategorySelectCollection", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "category-id";
    const mockPreview = true;
    const mockResponse = {
      data: {
        rac_categorySelect: {
          sys: {
            id: "category-select-id",
          },
          categoryName: "Update my details",
          contentCollection: {
            items: [
              {
                __typename: "WebCardWrapper",
                sys: {
                  id: "web-card-id-1",
                },
              },
              {
                __typename: "WebCardWrapper",
                sys: {
                  id: "web-card-id-2",
                },
              },
              {
                __typename: "ContactMethods",
                sys: {
                  id: "phone-number-id-1",
                },
              },
              {
                __typename: "FaqSection",
                sys: {
                  id: "faq-section-id",
                },
              },
            ],
          },
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);

    const result = await getCategorySelectCollection(mockId);

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
    const mockId = "empty-id";
    const mockResponse = {
      items: [],
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCategorySelectCollection(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getCategorySelectCollection(mockId)).rejects.toThrow("GraphQL error");
  });
});
