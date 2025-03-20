import { describe, expect, it } from "vitest";

import noRemovalValidator from ".";

const options = {
  message: "Removal Not Allowed",
};

const noInitialMeta = {
  initial: null,
};

const withInitialMeta = {
  initial: "TEST",
};

describe("No Removal Validator", () => {
  it("should return undefined with no initial value", () => {
    expect(noRemovalValidator(options)(null, undefined, noInitialMeta)).toBeUndefined();
  });

  it("should return message with removed value", () => {
    expect(noRemovalValidator(options)("", undefined, withInitialMeta)).toEqual("Removal Not Allowed");
  });

  it("should return undefined with changed value", () => {
    expect(noRemovalValidator(options)("TEST CHANGED", undefined, withInitialMeta)).toBeUndefined();
  });

  it("should return undefined with unchanged value", () => {
    expect(noRemovalValidator(options)("TEST", undefined, withInitialMeta)).toBeUndefined();
  });
});
