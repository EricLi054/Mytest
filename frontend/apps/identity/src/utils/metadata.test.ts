import { describe, expect, it } from "vitest";

import { getPageTitle } from "./metadata";

describe("getPageTitle", () => {
  it("should return the base title when no suffix is provided", () => {
    const result = getPageTitle();

    expect(result).toBe("myRAC registration");
  });

  it("should include a page name if provided", () => {
    const result = getPageTitle("Set up your identity");

    expect(result).toBe("Set up your identity | myRAC registration");
  });

  it("should handle empty string suffix correctly", () => {
    const result = getPageTitle("");

    expect(result).toBe("myRAC registration");
  });
});
