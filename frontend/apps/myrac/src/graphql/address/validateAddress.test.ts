import type { z } from "zod";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { AddressValidationSchema } from "./schema";
import { validateAddress } from ".";

vi.mock("server-only", () => ({}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("ValidateAddress Graphql", () => {
  it("should return validated address", async () => {
    const mockAddress: z.infer<typeof AddressValidationSchema> = {
      validatePAF: {
        data: {
          id: "123",
          attributes: {
            buildingName: "",
            subBuildingNumber: "",
            unit: "",
            allotmentNumber: "",
            buildingNumber: "832",
            streetName: "Wellington",
            streetType: "St",
            postalDeliveryNumber: "",
            locality: "WEST PERTH",
            stateCode: "WA",
            postcode: "6005",
            country: "AUSTRALIA",
          },
        },
      },
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockAddress }));
    const data = await validateAddress("anything");

    expect(data).toEqual(mockAddress.validatePAF.data);
  });
});
