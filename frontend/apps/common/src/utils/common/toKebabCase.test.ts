import { describe, expect, it } from "vitest";

import { toKebabCase } from "./toKebabCase";

describe("toKebabCase", () => {
  it("should convert a simple string to kebab case", () => {
    expect(toKebabCase("Hello World")).toBe("hello-world");
  });

  it("should handle multiple spaces correctly", () => {
    expect(toKebabCase("Hello    World")).toBe("hello-world");
  });

  it("should return a lowercase string", () => {
    expect(toKebabCase("HELLO WORLD")).toBe("hello-world");
  });

  it("should handle empty strings", () => {
    expect(toKebabCase("")).toBe("");
  });

  it("should handle strings with no spaces", () => {
    expect(toKebabCase("HelloWorld")).toBe("helloworld");
  });

  it("should handle strings with special characters", () => {
    expect(toKebabCase("Hello @ World!")).toBe("hello-@-world!");
  });

  it("should handle strings with numeric values", () => {
    expect(toKebabCase("Hello 123 World")).toBe("hello-123-world");
  });
});
