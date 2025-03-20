import type { AddressListSchema, AddressValidationSchema } from "#graphql/address/schema";
import type { z } from "zod";
import { getAddressList, validateAddress } from "#graphql/address";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import type { AddressInputValidatedValue, ParsedAddressValue } from "./schema";
import { searchAddress, validateSelectedAddress } from "./util";

testHelper.mockEnvironmentVariableProvider();

vi.mock("server-only", () => ({}));
vi.mock("#graphql/address", () => ({
  getAddressList: vi.fn(),
  validateAddress: vi.fn(),
}));

const mockToValidate: z.infer<typeof ParsedAddressValue> = {
  value: "Anything",
  label: "Anything",
};

const mockValidateAddressResponse: z.infer<typeof AddressValidationSchema> = {
  validatePAF: {
    data: {
      id: "dpid",
      attributes: {
        buildingName: "buildingName",
        subBuildingNumber: "subBuildingNumber",
        unit: "unit",
        allotmentNumber: "allotmentNumber",
        buildingNumber: "buildingNumber",
        streetName: "streetName",
        streetType: "",
        postalDeliveryNumber: "",
        locality: "locality",
        stateCode: "stateCode",
        postcode: "postcode",
        country: "country",
      },
    },
  },
};

const mockValidatedAddress: z.infer<typeof AddressInputValidatedValue> = {
  dpid: "dpid",
  buildingName: "buildingName",
  subBuildingNumber: "subBuildingNumber",
  unitNumber: "unit",
  lotNumber: "allotmentNumber",
  houseNumber: "buildingNumber",
  streetName: "streetName",
  poBox: "",
  suburb: "locality",
  state: "stateCode",
  postcode: "postcode",
  country: "country",
};

const mockGetAddressListResponse: z.infer<typeof AddressListSchema> = {
  addressList: {
    data: [
      {
        id: "dpid1",
        attributes: {
          partialAddress: "partialAddress1",
          picklist: "picklist1",
        },
      },
      {
        id: "dpid2",
        attributes: {
          partialAddress: "partialAddress2",
          picklist: "picklist2",
        },
      },
    ],
  },
};

const mockSearchAddressResponse = [
  {
    value: "dpid1",
    label: "partialAddress1",
  },
  {
    value: "dpid2",
    label: "partialAddress2",
  },
];

describe("Address Input Utils", () => {
  it("should return validated address when successful", async () => {
    vi.mocked(validateAddress).mockReturnValueOnce(Promise.resolve(mockValidateAddressResponse.validatePAF.data));

    expect(await validateSelectedAddress(mockToValidate)).toEqual(mockValidatedAddress);
  });

  it("should return null when can't validate address", async () => {
    vi.mocked(validateAddress).mockRejectedValue(new Error("Validation Endpoint down"));

    expect(await validateSelectedAddress(mockToValidate)).toBeNull();
  });

  it("should return address list when successful", async () => {
    vi.mocked(getAddressList).mockReturnValueOnce(Promise.resolve(mockGetAddressListResponse.addressList.data));

    expect(await searchAddress("Address")).toEqual({ options: mockSearchAddressResponse, error: false });
  });

  it("should return error state when can't search", async () => {
    vi.mocked(getAddressList).mockRejectedValue(new Error("Address List Endpoint down"));

    expect(await searchAddress("Address")).toEqual({ options: [], error: true });
  });
});
