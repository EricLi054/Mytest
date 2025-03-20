import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCloudinaryAsset } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getCloudinaryAsset", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "asset-123";
    const mockResponse = {
      cloudinaryAsset: {
        title: "Asset Title",
        image: "asset-image-url",
        image_data: [
          {
            context: {
              custom: {
                alt: "Asset Alt",
                caption: "Asset Caption",
              },
            },
          },
        ],
        showCaption: true,
        link: "https://domain.com/",
        openLinkInNewTab: true,
        fillContainerWidth: true,
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCloudinaryAsset(mockId);

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
    const mockResponse = { cloudinaryAsset: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCloudinaryAsset(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getCloudinaryAsset(mockId)).rejects.toThrow("GraphQL error");
  });
});
