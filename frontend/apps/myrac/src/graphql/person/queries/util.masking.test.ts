import { describe, expect, it } from "vitest";

import { maskEmail, maskLandline, maskMobileNumber, padLandline, padMobileNumber } from "./util.masking";

describe("Person Masking Utils", () => {
  it("should return input mobile when not right length", () => {
    expect(padMobileNumber("04001234")).toEqual("04001234");
  });

  it("should return correct padded mobile number", () => {
    expect(padMobileNumber("0400123456")).toEqual("0400 123 456");
  });

  it("should return correct masked mobile number", () => {
    expect(maskMobileNumber("0400123456")).toEqual("04** *** 456");
  });

  it("should return input landline when not right length", () => {
    expect(padLandline("9300123")).toEqual("9300123");
  });

  it("should return correct padded landline with no area code", () => {
    expect(padLandline("93001234")).toEqual("9300 1234");
  });

  it("should return correct padded landline with area code", () => {
    expect(padLandline("0893001234")).toEqual("08 9300 1234");
  });

  it("should return correct masked landline with no area code", () => {
    expect(maskLandline("93001234")).toEqual("**** *234");
  });

  it("should return correct masked landline with area code", () => {
    expect(maskLandline("0893001234")).toEqual("08 **** *234");
  });

  it("should return unmasked invalid email", () => {
    expect(maskEmail("not-an-email")).toEqual("not-an-email");
  });

  it("should return correct masked email with short name", () => {
    expect(maskEmail("te@rac.com.au")).toEqual("**@rac.com.au");
  });

  it("should return correct masked email", () => {
    expect(maskEmail("testEmail@rac.com.au")).toEqual("t*******l@rac.com.au");
  });
});
