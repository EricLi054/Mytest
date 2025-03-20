import { describe, expect, it } from "vitest";

import { truncate } from "./truncate";

describe("truncate", () => {
  it("should return the original text if it is shorter than or equal to maxLength", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("World", 5)).toBe("World");
  });

  it("should truncate the text to maxLength if it is longer", () => {
    expect(truncate("Hello, World!", 5)).toBe("Hello");
    expect(truncate("JavaScript", 4)).toBe("Java");
  });

  it("should trim trailing whitespace after truncation", () => {
    expect(truncate("Hello, World! ", 6)).toBe("Hello,");
    expect(truncate("Test text   ", 8)).toBe("Test tex");
  });

  it("should handle empty string input", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("should handle edge cases like maxLength being 0", () => {
    expect(truncate("Hello", 0)).toBe("");
    expect(truncate("", 0)).toBe("");
  });
});
