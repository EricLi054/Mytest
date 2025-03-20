import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { RacwaRedirectEdit } from ".";
import { componentTypes } from "..";

export default {
  title: "MyRAC/Components/Data Driven Forms/Redirect Edit",
  component: RacwaRedirectEdit,
  tags: ["@racwa/myrac"],
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "redirect",
        label: "Label",
        content: "Some data you can edit elsewhere",
        link: "#",
        component: componentTypes.REDIRECT_EDIT,
      },
    ],
  },
};
