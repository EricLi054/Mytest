import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { RacwaFixedLabelPlainText } from ".";
import { componentTypes } from "..";

export default {
  title: "MyRAC/Components/Data Driven Forms/Fixed Sized Label",
  component: RacwaFixedLabelPlainText,
  tags: ["@racwa/myrac"],
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "fixed",
        label: "Mobile 12345678",
        fixedLabelWidth: "200px",
        component: componentTypes.FIXED_LABEL_PLAIN_TEXT,
      },
    ],
  },
};

export const WithStyling = DDFStoryTemplate.bind({});
WithStyling.args = {
  schema: {
    fields: [
      {
        name: "title",
        label: "Home 12345678",
        fixedLabelWidth: "100px",
        sx: {
          fontWeight: "bold",
        },
        component: componentTypes.FIXED_LABEL_PLAIN_TEXT,
      },
    ],
  },
};
