import { describe, expect, it } from "vitest";

import { INVALID_ERROR, REQUIRED_ERROR } from "../constants";
import { getHelperText } from "./getHelperText";

describe("getHelperText", () => {
  it("should return the required message if the errors include REQUIRED_ERROR", () => {
    const errors = [REQUIRED_ERROR];
    const requiredMessage = "This field is required.";
    const invalidMessage = "This field is invalid.";

    const result = getHelperText({ errors, requiredMessage, invalidMessage });

    expect(result).toBe(requiredMessage);
  });

  it("should return the invalid message if the errors include INVALID_ERROR", () => {
    const errors = [INVALID_ERROR];
    const requiredMessage = "This field is required.";
    const invalidMessage = "This field is invalid.";

    const result = getHelperText({ errors, requiredMessage, invalidMessage });

    expect(result).toBe(invalidMessage);
  });

  it("should return undefined if they do not include REQUIRED_ERROR or INVALID_ERROR", () => {
    const errors = ["Some other error"];
    const requiredMessage = "This field is required.";
    const invalidMessage = "This field is invalid.";

    const result = getHelperText({ errors, requiredMessage, invalidMessage });

    expect(result).toBe(undefined);
  });

  it("should return undefined if errors is undefined", () => {
    const requiredMessage = "This field is required.";
    const invalidMessage = "This field is invalid.";

    const result = getHelperText({ errors: undefined, requiredMessage, invalidMessage });

    expect(result).toBeUndefined();
  });

  it("should return undefined if errors is an empty array", () => {
    const errors: string[] = [];
    const requiredMessage = "This field is required.";
    const invalidMessage = "This field is invalid.";

    const result = getHelperText({ errors, requiredMessage, invalidMessage });

    expect(result).toBe(undefined);
  });
});
