import type { ContentfulButton } from "#types/horizons/button";
import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getButton } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getButton", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "12345";
    const mockResponse: ContentfulButton = {
      data: {
        horizons_button: {
          title: "Test Button",
          variant: "contained",
          colour: "primary",
          text: "A Test Button",
          link: "https://rac.com.au",
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getButton(mockId);

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

    const result = await getButton(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getButton(mockId)).rejects.toThrow("GraphQL error");
  });
});
