import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getCategorySelectComponents } from "./actions";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

describe("getCategorySelect", () => {
  it("should call execute with correct query and variables", async () => {
    const mockId = "mock-id";
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

    const result = await getCategorySelectComponents(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should handle an empty response gracefully", async () => {
    const mockId = "mock-id";
    const mockResponse = {
      undefined,
    };

    (execute as Mock).mockResolvedValue(mockResponse);

    const result = await getCategorySelectComponents(mockId);

    expect(result).toEqual(mockResponse);
  });
});
