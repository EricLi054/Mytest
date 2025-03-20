import { describe, expect, it } from "vitest";

import { getAccentColourFromCategoryColour } from "./getAccentColourFromCategoryColour";

describe("getAccentColourFromCategoryColour", () => {
  it("should return the correct color for each category", () => {
    expect(getAccentColourFromCategoryColour("red")).toBe("#ea1f23");
    expect(getAccentColourFromCategoryColour("orange")).toBe("#f16e00");
    expect(getAccentColourFromCategoryColour("green")).toBe("#62a602");
    expect(getAccentColourFromCategoryColour("navy")).toBe("#0c376b");
    expect(getAccentColourFromCategoryColour("pink")).toBe("#cb0263");
    expect(getAccentColourFromCategoryColour("purple")).toBe("#aa0fdd");
    expect(getAccentColourFromCategoryColour("blue")).toBe("#029ed6");
  });

  it("should be case-insensitive for category names", () => {
    expect(getAccentColourFromCategoryColour("RED")).toBe("#ea1f23");
    expect(getAccentColourFromCategoryColour("Orange")).toBe("#f16e00");
    expect(getAccentColourFromCategoryColour("GrEeN")).toBe("#62a602");
  });

  it("should return the default color for unknown categories", () => {
    expect(getAccentColourFromCategoryColour("unknown")).toBe("#0C376B");
    expect(getAccentColourFromCategoryColour("")).toBe("#0C376B");
    expect(getAccentColourFromCategoryColour("123")).toBe("#0C376B");
  });
});
