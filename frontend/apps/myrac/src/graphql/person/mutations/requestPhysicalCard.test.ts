import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { RequestPhysicalCardSchema } from "./schema";
import { requestPhysicalCard } from ".";

type RequestPhysicalCardResponse = Zod.infer<typeof RequestPhysicalCardSchema>;

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("RequestPhysicalCard Graphql", () => {
  it("should return request response", async () => {
    const mockRequestResponse: RequestPhysicalCardResponse = {
      requestPhysicalCard: {
        physicalCardResponse: {
          isSuccess: true,
          value: "Request Sent",
        },
        errors: null,
      },
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));
    const data = await requestPhysicalCard();

    expect(data).toEqual(mockRequestResponse);
  });
});
