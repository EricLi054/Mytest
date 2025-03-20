import type { WebsitePage } from "#types/common/basePage";
import type { RichTextProps } from "#types/common/richTextProps";
import type { SeoMetaData } from "#types/common/seoMetaData";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

export const TestSeoMetaData: SeoMetaData = {
  title: "Test SEO",
  description: "SEO Description",
  keywords: "test",
  image: null,
};

export const TestWebsitePage: WebsitePage = {
  slug: "test-page",
  nameOfInstance: "Page Title",
  banner: { __typename: "banner", sys: { id: "12345" } },
  seoMetaTags: TestSeoMetaData,
  contentCollection: {
    content: {
      __typename: "content",
      sys: { id: "1234" },
    },
  },
};

export const TestFAQ: RichTextProps = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.HR,
        data: {},
        content: [],
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: "text",
            value: " ",
            marks: [],
            data: {},
          },
          {
            nodeType: INLINES.HYPERLINK,
            data: {
              uri: "/faq/how-to-do-a",
            },
            content: [
              {
                nodeType: "text",
                value: "How do I do A?",
                marks: [],
                data: {},
              },
            ],
          },
          {
            nodeType: "text",
            value: "",
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
            nodeType: INLINES.HYPERLINK,
            data: {
              uri: "/faq/how-to-do-b",
            },
            content: [
              {
                nodeType: "text",
                value: "How do I do B?",
                marks: [],
                data: {},
              },
            ],
          },
          {
            nodeType: "text",
            value: "",
            marks: [],
            data: {},
          },
        ],
      },
    ],
  },
};
