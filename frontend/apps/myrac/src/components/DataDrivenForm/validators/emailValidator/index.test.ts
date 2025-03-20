import { describe, expect, it } from "vitest";

import emailValidator from ".";

const options = {
  message: "Invalid Email",
};

describe("Email Validator", () => {
  it("should return undefined with no input", () => {
    expect(emailValidator(options)(null)).toBeUndefined();
  });

  it("should return message with invalid email", () => {
    expect(emailValidator(options)("not-an-email")).toEqual("Invalid Email");
  });

  it("should return undefined with valid email", () => {
    expect(emailValidator(options)("email@email.com")).toBeUndefined();
  });
});
