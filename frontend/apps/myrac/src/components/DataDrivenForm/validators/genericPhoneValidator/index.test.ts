import { describe, expect, it } from "vitest";

import genericPhoneValidator from ".";

const mobileOptions = {
  message: "Invalid Mobile",
  phoneType: "MOBILE",
};

const landlineOptions = {
  message: "Invalid Landline",
  phoneType: "LANDLINE",
};

const invalidType = {
  message: "Invalid Landline",
  phoneType: "NOTAPHONE",
};

describe("Generic Phone Validator", () => {
  it("should return undefined with no input", () => {
    expect(genericPhoneValidator(mobileOptions)(null)).toBeUndefined();
  });

  it("should return undefined with invalid phone type", () => {
    expect(genericPhoneValidator(invalidType)("0400000000")).toBeUndefined();
  });

  it("should return undefined with valid mobile", () => {
    expect(genericPhoneValidator(mobileOptions)("0400000000")).toBeUndefined();
  });

  it("should return undefined with valid mobile with padding", () => {
    expect(genericPhoneValidator(mobileOptions)("0400 000 000")).toBeUndefined();
  });

  it("should return message with invalid mobile", () => {
    expect(genericPhoneValidator(mobileOptions)("04000000001")).toEqual("Invalid Mobile");
  });

  it("should return undefined with valid landline", () => {
    expect(genericPhoneValidator(landlineOptions)("93001234")).toBeUndefined();
  });

  it("should return undefined with valid landline with area code", () => {
    expect(genericPhoneValidator(landlineOptions)("0893001234")).toBeUndefined();
  });

  it("should return undefined with valid landline with padding", () => {
    expect(genericPhoneValidator(landlineOptions)("9300 1234")).toBeUndefined();
  });

  it("should return message with invalid landline", () => {
    expect(genericPhoneValidator(landlineOptions)("930012345")).toEqual("Invalid Landline");
  });
});
