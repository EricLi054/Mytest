import type { RichTextProps } from "#types/common/richTextProps";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { TestCategory } from "#testing/data/testData";
import { describe, expect, it } from "vitest";

import ContentfulRichTextRenderer from ".";

describe("ContentfulRichTextRenderer", () => {
  it("should render a heading with accent border if isArticlePage is true", () => {
    const text: RichTextProps = {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.HEADING_1,
            data: {},
            content: [{ nodeType: "text", value: "Heading 1", marks: [], data: {} }],
          },
        ],
      },
      links: undefined,
    };

    render(<ContentfulRichTextRenderer text={text} isArticlePage={true} category={TestCategory} />);

    expect(screen.getByText("Heading 1")).toBeVisible();
  });

  it("should render a paragraph with plain text", () => {
    const text: RichTextProps = {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [{ nodeType: "text", value: "This is a paragraph.", marks: [], data: {} }],
          },
        ],
      },
      links: undefined,
    };

    render(<ContentfulRichTextRenderer text={text} />);

    expect(screen.getByText("This is a paragraph.")).toBeVisible();
  });

  it("should gracefully handle unknown entry types for both block and inline entries", () => {
    const text: RichTextProps = {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: INLINES.EMBEDDED_ENTRY,
                data: { target: { sys: { id: "unknown-1" } } },
                content: [],
              },
            ],
          },
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: { target: { sys: { id: "unknown-2" } } },
            content: [],
          },
        ],
      },
      links: {
        entries: {
          inline: [{ sys: { id: "unknown-1" }, __typename: "UnknownType" }],
          block: [{ sys: { id: "unknown-2" }, __typename: "UnknownType" }],
        },
      },
    };

    render(<ContentfulRichTextRenderer text={text} />);

    expect(screen.queryByTestId("unknown-1")).toBeNull();
    expect(screen.queryByTestId("unknown-2")).toBeNull();
  });
});
