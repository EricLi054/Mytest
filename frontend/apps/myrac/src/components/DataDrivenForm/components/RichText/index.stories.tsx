import { BLOCKS } from "@contentful/rich-text-types";
import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { RacwaRichText } from ".";
import { componentTypes } from "..";

export default {
  title: "MyRAC/Components/Data Driven Forms/Rich Text",
  component: RacwaRichText,
  tags: ["@racwa/myrac"],
};

const richText = {
  json: {
    data: {},
    content: [
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 1",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_1,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 2",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_2,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 3",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_3,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 4",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_4,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 5",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_5,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Heading 6",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.HEADING_6,
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "Paragraph",
            nodeType: "text",
          },
        ],
        nodeType: BLOCKS.PARAGRAPH,
      },
    ],
    nodeType: "document",
  },
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "rich-text",
        richText,
        component: componentTypes.RICH_TEXT,
      },
    ],
  },
  //   template: ({ formFields }) => {
  //     return <form>{formFields as ReactNode}</form>;
  //   }
};
