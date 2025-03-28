import { expect, screen, userEvent, waitFor } from "@storybook/test";
import { DDFStoryTemplate } from "#components/DataDrivenForm/testHelper/storybook";

import { TextField } from ".";
import { componentTypes } from "..";
import { validatorTypes } from "../../validators";

export default {
  title: "MyRAC/Components/Data Driven Forms/Text Input",
  component: TextField,
  tags: ["@racwa/myrac"],
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: "text-input",
        label: "Text Input",
        disableGTM: true,
        helperText: "Help text",
        placeholder: "e.g. Stuff",
        required: false,
        component: componentTypes.TEXT_FIELD,
      },
    ],
  },
};

export const WithInitialValue = DDFStoryTemplate.bind({});
WithInitialValue.args = {
  schema: {
    fields: [
      {
        name: "text-input",
        label: "Text Input",
        disableGTM: true,
        helperText: "Help text",
        placeholder: "e.g. Stuff",
        required: false,
        component: componentTypes.TEXT_FIELD,
        initializeOnMount: true,
        initialValue: "Initial Value",
      },
    ],
  },
};

export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: "text-input",
        label: "Text Input",
        disableGTM: true,
        helperText: "Help text",
        placeholder: "e.g. Stuff",
        component: componentTypes.TEXT_FIELD,
        required: true,
        validate: [{ type: validatorTypes.REQUIRED }],
        initializeOnMount: true,
        initialValue: "Initial Value",
      },
    ],
  },
};
WithRequiredValidation.play = async () => {
  const input = screen.getByDisplayValue("Initial Value");
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.click(document.body); // click away to trigger validation
  await waitFor(async () => {
    await expect(input).toBeInvalid();
  });
};

export const WithTooltip = DDFStoryTemplate.bind({});
WithTooltip.args = {
  schema: {
    fields: [
      {
        name: "text-input",
        label: "Text Input",
        disableGTM: true,
        helperText: "Help text",
        placeholder: "e.g. Stuff",
        required: false,
        tooltipTitle: "This is my tooltip title",
        tooltipText: "This is my tooltip text",
        component: componentTypes.TEXT_FIELD,
      },
    ],
  },
};
WithTooltip.play = async () => {
  const tooltip = screen.getByRole("button");
  await userEvent.click(tooltip);
};

export const WithDisabledSet = DDFStoryTemplate.bind({});
WithDisabledSet.args = {
  schema: {
    fields: [
      {
        name: "text-input",
        label: "Text Input",
        disableGTM: true,
        helperText: "Help text",
        placeholder: "e.g. Stuff",
        required: false,
        component: componentTypes.TEXT_FIELD,
        disabled: true,
      },
    ],
  },
};
