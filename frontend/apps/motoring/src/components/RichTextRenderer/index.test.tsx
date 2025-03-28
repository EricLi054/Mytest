import "@testing-library/jest-dom";

import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { RichText } from "./types";
import RichTextRenderer from ".";

const mockRichText: RichText = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "Hello, world!",
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
};

describe("RichTextRenderer", () => {
  it("should render rich text content", () => {
    render(<RichTextRenderer json={mockRichText.text.json} />);

    expect(screen.getByText("Hello, world!")).toBeVisible();
  });

  it("should throw an error when rendering invalid rich text content", () => {
    const invalidRichText = { json: null } as unknown as RichText;

    expect(() => render(<RichTextRenderer json={invalidRichText.text.json} />)).toThrow();
  });
});
