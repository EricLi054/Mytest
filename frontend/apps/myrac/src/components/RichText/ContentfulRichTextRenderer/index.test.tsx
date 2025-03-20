import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ContentfulRichTextRenderer from ".";

vi.mock("server-only", () => ({}));

vi.mock("#components/Links/ContentfulLink", () => {
  return {
    default: ({ id }: { id: string }) => <span>Link-{id}</span>,
  };
});

vi.mock("#components/Buttons/ContentfulButton", () => {
  return {
    default: ({ id }: { id: string }) => <span>Button-{id}</span>,
  };
});

vi.mock("../Mustache", () => {
  return {
    default: ({ id }: { id: string }) => <span>Mustache-{id}</span>,
  };
});

const validRichText: { text: z.infer<typeof RichTextSchema> } = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "Profile",
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "",
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: "123",
                    type: "Link",
                    linkType: "Entry",
                  },
                },
              },
              content: [],
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "",
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: "456",
                    type: "Button",
                    linkType: "Entry",
                  },
                },
              },
              content: [],
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "",
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: "789",
                    type: "MustacheTemplates",
                    linkType: "Entry",
                  },
                },
              },
              content: [],
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "",
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: "na",
                    type: "NotMapped",
                    linkType: "Entry",
                  },
                },
              },
              content: [],
            },
          ],
        },
      ],
    },
    links: {
      entries: {
        inline: [
          {
            __typename: "Link",
            sys: {
              id: "123",
            },
          },
          {
            __typename: "Button",
            sys: {
              id: "456",
            },
          },
          {
            __typename: "MustacheTemplates",
            sys: {
              id: "789",
            },
          },
          {
            __typename: "NotMapped",
            sys: {
              id: "na",
            },
          },
        ],
      },
    },
  },
};

describe("ContentfulRichTextRenderer", () => {
  it("should render rich text for valid json", () => {
    render(<>{ContentfulRichTextRenderer(validRichText)}</>);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Link-123")).toBeInTheDocument();
    expect(screen.getByText("Button-456")).toBeInTheDocument();
    expect(screen.getByText("Mustache-789")).toBeInTheDocument();
    expect(screen.getByText("Missing Rich Text Component: NotMapped")).toBeInTheDocument();
  });
});
