import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import defaultComponentTypes from '@/components/DataDrivenForm/dynamic-components/componentTypes';
import defaultValidatorTypes from '@/components/DataDrivenForm/validators/validatorTypes';
import { screen, userEvent, waitFor, expect } from '@storybook/test';
import { FormTextInput } from '@/components/DataDrivenForm/dynamic-components/TextInput/TextInput';
import FullHeight from '@/.storybook/fullHeightDecorator';

export default {
  title: 'Components/Data Driven Forms/Text Input',
  component: FormTextInput,
  tags: ['autodocs'],
  decorators: [FullHeight]
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'text-input',
        label: 'Text Input',
        disableGTM: true,
        helperText: 'Help text',
        placeholder: 'e.g. Stuff',
        component: defaultComponentTypes.TEXT_FIELD
      }
    ]
  }
};

export const WithInitialValue = DDFStoryTemplate.bind({});
WithInitialValue.args = {
  schema: {
    fields: [
      {
        name: 'text-input',
        label: 'Text Input',
        disableGTM: true,
        helperText: 'Help text',
        placeholder: 'e.g. Stuff',
        component: defaultComponentTypes.TEXT_FIELD
      }
    ]
  },
  initialValues: {
    'text-input': 'Initial Value'
  }
};

export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: 'text-input',
        label: 'Text Input',
        disableGTM: true,
        helperText: 'Help text',
        placeholder: 'e.g. Stuff',
        component: defaultComponentTypes.TEXT_FIELD,
        required: true,
        validate: [{ type: defaultValidatorTypes.REQUIRED }]
      }
    ]
  },
  initialValues: {
    'text-input': 'Initial Value'
  }
};
WithRequiredValidation.play = async () => {
  const input = screen.getByDisplayValue('Initial Value');
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
        name: 'text-input',
        label: 'Text Input',
        disableGTM: true,
        helperText: 'Help text',
        placeholder: 'e.g. Stuff',
        tooltipTitle: 'This is my tooltip title',
        tooltipText: 'This is my tooltip text',
        component: defaultComponentTypes.TEXT_FIELD
      }
    ]
  }
};
WithTooltip.play = async () => {
  const tooltip = screen.getByRole('button');
  await userEvent.click(tooltip);
};
