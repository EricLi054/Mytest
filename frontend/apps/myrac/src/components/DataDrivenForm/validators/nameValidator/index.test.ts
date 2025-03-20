import { describe, expect, it } from "vitest";

import nameValidator from ".";

const firstNameOptions = {
  message: "Invalid First Name",
  nameType: "firstName",
};

const middleNameOptions = {
  message: "Invalid Middle Name",
  nameType: "middleName",
};

const lastNameOptions = {
  message: "Invalid Last Name",
  nameType: "lastName",
};

const invalidType = {
  message: "Invalid Type",
  nameType: "NOTANAME",
};

describe("Name Validator", () => {
  it("should return undefined with no input", () => {
    expect(nameValidator(firstNameOptions)(null)).toBeUndefined();
  });

  it("should return undefined with invalid type", () => {
    expect(nameValidator(invalidType)("John")).toBeUndefined();
  });

  it("should return undefined with valid first name", () => {
    expect(nameValidator(firstNameOptions)("John")).toBeUndefined();
  });

  it("should return message with invalid first name", () => {
    expect(nameValidator(firstNameOptions)("John!!")).toEqual("Invalid First Name");
  });

  it("should return undefined with valid middle name", () => {
    expect(nameValidator(middleNameOptions)("John")).toBeUndefined();
  });

  it("should return undefined with empty middle name", () => {
    expect(nameValidator(middleNameOptions)("")).toBeUndefined();
  });

  it("should return message with invalid middle name", () => {
    expect(nameValidator(middleNameOptions)("John!!")).toEqual("Invalid Middle Name");
  });

  it("should return undefined with valid last name", () => {
    expect(nameValidator(lastNameOptions)("Doe")).toBeUndefined();
  });

  it("should return message with invalid last name", () => {
    expect(nameValidator(lastNameOptions)("Doe!!")).toEqual("Invalid Last Name");
  });
});
