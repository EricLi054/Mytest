// metadata.test.ts
import { describe, expect, it } from "vitest";

import { getPageTitle } from "./metadata";

describe("getPageTitle", () => {
  it("should return the base title when no suffix is provided", () => {
    const result = getPageTitle();

    expect(result).toBe("Roadside Assistance - Update your vehicle");
  });

  it("should return the base title with suffix when a suffix is provided", () => {
    const result = getPageTitle("My Suffix");

    expect(result).toBe("Roadside Assistance - Update your vehicle - My Suffix");
  });

  it("should handle empty string suffix correctly", () => {
    const result = getPageTitle("");

    expect(result).toBe("Roadside Assistance - Update your vehicle");
  });

  it("should handle special characters in suffix correctly", () => {
    const result = getPageTitle("Special!@#$%^&*()");

    expect(result).toBe("Roadside Assistance - Update your vehicle - Special!@#$%^&*()");
  });
});
