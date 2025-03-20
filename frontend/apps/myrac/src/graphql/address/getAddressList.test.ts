import type { z } from "zod";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { AddressListSchema } from "./schema";
import { getAddressList } from ".";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("AddressList Graphql", () => {
  it("should return addresses", async () => {
    const mockAddresses: z.infer<typeof AddressListSchema> = {
      addressList: {
        data: [
          {
            id: "123",
            attributes: {
              partialAddress: "123",
              picklist: "123",
            },
          },
        ],
      },
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockAddresses }));
    const data = await getAddressList("anything");

    expect(data).toEqual(mockAddresses.addressList.data);
  });
});
