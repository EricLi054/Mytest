import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { RacwaInfoAlert } from ".";
import { componentTypes } from "..";

export default {
  title: "MyRAC/Components/Data Driven Forms/Info Alert",
  component: RacwaInfoAlert,
  tags: ["@racwa/myrac"],
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "info",
        label: "Header",
        helperText: "Body",
        component: componentTypes.INFO_ALERT,
      },
    ],
  },
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
            marks: [
              {
                type: "bold",
              },
            ],
            value: "Example rich text heading",
            nodeType: "text",
          },
        ],
        nodeType: "paragraph",
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "subheading",
            nodeType: "text",
          },
        ],
        nodeType: "paragraph",
      },
    ],
    nodeType: "document",
  },
};

export const WithRichTextHeading = DDFStoryTemplate.bind({});
WithRichTextHeading.args = {
  schema: {
    fields: [
      {
        name: "info",
        richText,
        helperText: "Body",
        component: componentTypes.INFO_ALERT,
      },
    ],
  },
};
