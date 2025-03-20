import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { RacwaButtonSelect } from ".";
import { componentTypes } from "..";
import { validatorTypes } from "../../validators";

export default {
  title: "MyRAC/Components/Data Driven Forms/Button Select",
  component: RacwaButtonSelect,
  tags: ["@racwa/myrac"],
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "title",
        label: "Title",
        helperText: "Help text",
        disableGTM: true,
        fullWidth: true,
        required: false,
        component: componentTypes.BUTTON_SELECT,
        options: [
          {
            value: "Mr",
          },
          {
            value: "Mrs",
          },
          {
            value: "Miss",
          },
          {
            value: "Ms",
          },
          {
            value: "Mx",
          },
          {
            value: "Dr",
          },
        ],
      },
    ],
  },
};

export const WithInitialValue = DDFStoryTemplate.bind({});
WithInitialValue.args = {
  schema: {
    fields: [
      {
        name: "title",
        label: "Title",
        helperText: "Help text",
        disableGTM: true,
        fullWidth: true,
        required: false,
        component: componentTypes.BUTTON_SELECT,
        options: [
          {
            value: "Mr",
          },
          {
            value: "Mrs",
          },
          {
            value: "Miss",
          },
          {
            value: "Ms",
          },
          {
            value: "Mx",
          },
          {
            value: "Dr",
          },
        ],
        initializeOnMount: true,
        initialValue: "Miss",
      },
    ],
  },
};

// TODO: Is there a way to clear this components value so the red message appears?
export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: "title",
        label: "Title",
        helperText: "Help text",
        disableGTM: true,
        fullWidth: true,
        component: componentTypes.BUTTON_SELECT,
        options: [
          {
            value: "Mr",
          },
          {
            value: "Mrs",
          },
          {
            value: "Miss",
          },
          {
            value: "Ms",
          },
          {
            value: "Mx",
          },
          {
            value: "Dr",
          },
        ],
        required: true,
        validate: [{ type: validatorTypes.REQUIRED }],
      },
    ],
  },
};
