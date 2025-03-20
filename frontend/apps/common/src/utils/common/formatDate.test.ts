import { describe, expect, it } from "vitest";

import { formatDate } from "./formatDate"; // Adjust the path as needed

describe("formatDate", () => {
  it("should format a valid date string correctly", () => {
    expect(formatDate("2024-11-22")).toBe("Nov 2024");
    expect(formatDate("2020-01-15")).toBe("Jan 2020");
  });

  it("should handle different date formats", () => {
    expect(formatDate("2024-12-01T10:00:00Z")).toBe("Dec 2024");
    expect(formatDate("2024-02-29")).toBe("Feb 2024"); // Leap year
  });

  it("should handle invalid date strings gracefully", () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date NaN");
    expect(formatDate("")).toBe("Invalid Date NaN");
  });

  it("should handle edge cases like Unix epoch", () => {
    expect(formatDate("1970-01-01")).toBe("Jan 1970");
  });

  it("should work with ISO 8601 strings", () => {
    expect(formatDate("2024-11-22T15:30:00.000Z")).toBe("Nov 2024");
  });

  it("should format valid Date objects correctly", () => {
    expect(formatDate(new Date("2024-11-22"))).toBe("Nov 2024");
    expect(formatDate(new Date("2020-01-15"))).toBe("Jan 2020");
  });

  it("should handle invalid Date objects gracefully", () => {
    expect(formatDate(new Date("invalid-date"))).toBe("Invalid Date NaN");
  });

  it("should work with current Date objects", () => {
    const currentDate = new Date();
    const expected = `${currentDate.toLocaleString("default", {
      month: "short",
    })} ${currentDate.getFullYear()}`;

    expect(formatDate(currentDate)).toBe(expected);
  });
});
