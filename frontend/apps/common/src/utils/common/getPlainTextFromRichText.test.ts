import type { Document } from "@contentful/rich-text-types";
import type { Mock } from "vitest";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { describe, expect, it, vi } from "vitest";

import { getPlainTextFromRichText } from "./getPlainTextFromRichText";

// Mock the documentToPlainTextString function
vi.mock("@contentful/rich-text-plain-text-renderer", () => ({
  documentToPlainTextString: vi.fn(),
}));

describe("getPlainTextFromRichText", () => {
  it("should return plain text for a valid rich text document", () => {
    const mockDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: "text",
              marks: [],
              value: "This is plain text",
              data: {},
            },
          ],
          data: {},
        },
      ],
    };

    // Mock the behavior of documentToPlainTextString
    const mockPlainText = "This is plain text";
    (documentToPlainTextString as Mock).mockReturnValue(mockPlainText);

    const result = getPlainTextFromRichText(mockDocument);

    expect(result).toBe(mockPlainText);
    expect(documentToPlainTextString).toHaveBeenCalledWith(mockDocument);
  });

  it("should handle empty rich text documents", () => {
    const emptyDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    const mockPlainText = "";
    (documentToPlainTextString as Mock).mockReturnValue(mockPlainText);

    const result = getPlainTextFromRichText(emptyDocument);

    expect(result).toBe(mockPlainText);
    expect(documentToPlainTextString).toHaveBeenCalledWith(emptyDocument);
  });

  it("should throw an error if documentToPlainTextString fails", () => {
    const invalidDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HR,
          content: [
            {
              nodeType: "text",
              marks: [],
              value: "This is plain text",
              data: {},
            },
          ],
          data: {},
        },
      ],
    };

    // Simulate a thrown error
    (documentToPlainTextString as Mock).mockImplementation(() => {
      throw new Error("Invalid document");
    });

    expect(() => getPlainTextFromRichText(invalidDocument)).toThrow("Invalid document");
  });
});
