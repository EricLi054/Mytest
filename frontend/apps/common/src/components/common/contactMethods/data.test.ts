import type { Mock } from "vitest";
import { serverEnv } from "#env/server";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getContactMethods } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getContactMethods", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "12345";
    const mockPreview = true;
    const mockResponse = {
      rac_contactMethods: {
        heading: "Test Contact Methods",
        rendering: "Grid",
        contactNumbersCollection: {
          items: [
            {
              businessAreaCovered: "Test Area",
              phoneCovered: "0412345678",
              openingHours: "Test hours",
              additionalOpeningHours: "Test Additional",
            },
          ],
        },
      },
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getContactMethods(mockId);

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
    const mockId = "0222";
    const mockResponse = {
      banner: null,
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getContactMethods(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if execute fails", async () => {
    const mockId = "123";
    (execute as Mock).mockRejectedValue(new Error("GraphQL error"));

    await expect(getContactMethods(mockId)).rejects.toThrow("GraphQL error");
  });
});
