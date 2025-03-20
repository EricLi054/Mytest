import { describe, expect, it } from "vitest";

import addressValidator from ".";

const mockAddress = {
  dpid: null,
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

const mockValidatedAddress = {
  ...mockAddress,
  dpid: "dpid",
};

const options = {
  message: "Invalid Address",
};

describe("Address Validator", () => {
  it("should return undefined with valid address", () => {
    expect(addressValidator(options)(mockValidatedAddress)).toBeUndefined();
  });

  it("should return message with invalid address", () => {
    expect(addressValidator(options)(mockAddress)).toEqual("Invalid Address");
  });

  it("should return undefined with string input", () => {
    expect(addressValidator(options)("123 Test Street")).toBeUndefined();
  });
});
