import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getContactMethodsSection } from "./action";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

describe("getContactMethods", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "12345";
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

    const result = await getContactMethodsSection(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockId = "0222";
    const mockResponse = {
      banner: null,
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getContactMethodsSection(mockId);

    expect(result).toEqual(mockResponse);
  });
});
