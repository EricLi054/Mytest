import type { Document } from "@contentful/rich-text-types";
import type { Mock } from "vitest";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { describe, expect, it, vi } from "vitest";

import { calculateReadingTime } from "./calculateReadingTime";

// Mock the documentToPlainTextString function
vi.mock("@contentful/rich-text-plain-text-renderer", () => ({
  documentToPlainTextString: vi.fn(),
}));

describe("calculateReadingTime", () => {
  it("should calculate reading time for a document with a known word count", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    // Mock the plain text conversion
    (documentToPlainTextString as Mock).mockReturnValue("This is a test document with ten words.");

    const result = calculateReadingTime(mockDocument, 200);

    expect(result).toBe("1 min read");
    expect(documentToPlainTextString).toHaveBeenCalledWith(mockDocument);
  });

  it("should adjust reading time based on a custom words-per-minute value", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    (documentToPlainTextString as Mock).mockReturnValue("This is a test document with ten words.");

    const result = calculateReadingTime(mockDocument, 100); // Slower reading speed

    expect(result).toBe("1 min read");
  });

  it("should handle documents with many words correctly", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    (documentToPlainTextString as Mock).mockReturnValue("This is a very long document ".repeat(50).trim()); // 250 words

    const result = calculateReadingTime(mockDocument, 200);

    expect(result).toBe("2 min read");
  });

  it("should return 0 min read for an empty document", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    (documentToPlainTextString as Mock).mockReturnValue("");

    const result = calculateReadingTime(mockDocument, 200);

    expect(result).toBe("0 min read");
  });

  it("should throw an error if documentToPlainTextString fails", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    (documentToPlainTextString as Mock).mockImplementation(() => {
      throw new Error("Invalid document");
    });

    expect(() => calculateReadingTime(mockDocument)).toThrow("Invalid document");
  });
});
