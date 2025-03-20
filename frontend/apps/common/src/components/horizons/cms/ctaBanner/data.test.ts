import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCtaBanner } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getCtaBanner", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "cta-banner-123";
    const mockResponse = {
      ctaBanner: {
        title: "CTA Banner Title",
        image: {
          title: "Image Title",
          image: "image-url",
        },
        contentPosition: "left",
        category: "Category",
        heading: "Heading Text",
        subtext: "Subtext",
        buttonText: "Click Here",
        buttonUrl: "https://example.com",
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCtaBanner(mockId);

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
    const mockResponse = { ctaBanner: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCtaBanner(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getCtaBanner(mockId)).rejects.toThrow("GraphQL error");
  });
});
