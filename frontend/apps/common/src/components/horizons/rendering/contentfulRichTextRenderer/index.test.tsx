import type { RichTextProps } from "#types/common/richTextProps";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { TestCategory } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import ContentfulRichTextRenderer from ".";

vi.mock("server-only", () => ({}));

vi.mock("../../cms/cloudinaryAsset", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => (
    <span data-testid={`cloudinary-${data.sys.id}`}>CloudinaryAsset</span>
  ),
}));

vi.mock("../../cms/callToAction", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => <div data-testid={`cta-${data.sys.id}`}>CallToAction</div>,
}));

vi.mock("../../cms/youtubeEmbed", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => (
    <div data-testid={`youtube-${data.sys.id}`}>YoutubeEmbed</div>
  ),
}));

vi.mock("../../cms/instagramPost", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => (
    <div data-testid={`instagram-${data.sys.id}`}>InstagramPost</div>
  ),
}));

vi.mock("../../cms/contentRelatedArticle", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => (
    <div data-testid={`article-${data.sys.id}`}>ContentRelatedArticle</div>
  ),
}));

vi.mock("../../cms/button", () => ({
  __esModule: true,
  default: ({ data }: { data: { sys: { id: string } } }) => <div data-testid={`button-${data.sys.id}`}>Button</div>,
}));

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

    render(
      <ContentfulRichTextRenderer
        text={text}
        isArticlePage={true}
        category={TestCategory}
        relatedArticleVariant="advanced"
      />,
    );

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

  it("should render a block entry correctly", () => {
    const text: RichTextProps = {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: { target: { sys: { id: "cta-1" } } },
            content: [],
          },
        ],
      },
      links: {
        entries: {
          inline: [],
          block: [{ sys: { id: "cta-1" }, __typename: "horizons_CallToAction" }],
        },
      },
    };

    render(<ContentfulRichTextRenderer text={text} />);

    expect(screen.getByTestId("cta-cta-1")).toBeVisible();
  });

  it("should render multiple inline and block entries correctly", () => {
    const text: RichTextProps = {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              { nodeType: "text", value: "Text before", marks: [], data: {} },
              {
                nodeType: INLINES.EMBEDDED_ENTRY,
                data: { target: { sys: { id: "cloudinary-1" } } },
                content: [],
              },
            ],
          },
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: { target: { sys: { id: "instagram-1" } } },
            content: [],
          },
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: { target: { sys: { id: "youtube-1" } } },
            content: [],
          },
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: { target: { sys: { id: "article-1" } } },
            content: [],
          },
        ],
      },
      links: {
        entries: {
          inline: [{ sys: { id: "cloudinary-1" }, __typename: "horizons_CloudinaryAsset" }],
          block: [
            { sys: { id: "instagram-1" }, __typename: "horizons_InstagramPostEmbed" },
            { sys: { id: "youtube-1" }, __typename: "horizons_YoutubeEmbed" },
            { sys: { id: "article-1" }, __typename: "horizons_Article" },
            { sys: { id: "button-1" }, __typename: "horizons_Button" },
          ],
        },
      },
    };

    render(<ContentfulRichTextRenderer text={text} />);

    expect(screen.getByText("Text before")).toBeVisible();
    expect(screen.getByTestId("cloudinary-cloudinary-1")).toBeVisible();
    expect(screen.getByTestId("instagram-instagram-1")).toBeVisible();
    expect(screen.getByTestId("youtube-youtube-1")).toBeVisible();
    expect(screen.getByTestId("article-article-1")).toBeVisible();
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
