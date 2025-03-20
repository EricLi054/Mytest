import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCallToAction } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getCallToAction", () => {
  it("should call execute with correct query and variables", async () => {
    const mockPreview = true;
    const mockId = "cta-id";
    const mockResponse = {
      callToAction: {
        title: "Sample Call To Action",
        link: "/sample-link",
        linkText: "Click Here",
        image: {
          title: "Sample Image Title",
          image: "https://example.com/sample.jpg",
        },
        detailedDescription: {
          json: { nodeType: "document", content: [] },
        },
        finePrint: "Sample fine print text.",
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCallToAction(mockId);

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

  it("should handle null response for callToAction gracefully", async () => {
    const mockId = "invalid-cta-id";
    const mockResponse = { callToAction: null };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCallToAction(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "error-cta-id";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getCallToAction(mockId)).rejects.toThrow("GraphQL error");
  });
});
