import { FormSelectInput } from '@/components/DataDrivenForm/dynamic-components/SelectInput/SelectInput';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import defaultComponentTypes from '@/components/DataDrivenForm/dynamic-components/componentTypes';
import defaultValidatorTypes from '@/components/DataDrivenForm/validators/validatorTypes';
import { screen, userEvent, waitFor, expect } from '@storybook/test';
import FullHeight from '@/.storybook/fullHeightDecorator';

export default {
  title: 'Components/Data Driven Forms/Select Input',
  component: FormSelectInput,
  tags: ['autodocs'],
  decorators: [FullHeight]
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'select-input',
        label: 'Select',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.SELECT,
        options: [
          {
            value: 'Option 1'
          },
          {
            value: 'Option 2'
          },
          {
            value: 'Option 3'
          }
        ]
      }
    ]
  }
};

export const WithInitialValue = DDFStoryTemplate.bind({});
WithInitialValue.args = {
  schema: {
    fields: [
      {
        name: 'select-input',
        label: 'Select',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.SELECT,
        options: [
          {
            value: 'Option 1'
          },
          {
            value: 'Option 2'
          },
          {
            value: 'Option 3'
          }
        ]
      }
    ]
  },
  initialValues: {
    'select-input': 'Option 1'
  }
};
WithInitialValue.play = async () => {
  const input = screen.getByText('Option 1');
  await userEvent.click(input);
};

export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: 'select-input',
        label: 'Select',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.SELECT,
        options: [
          {
            value: ''
          },
          {
            value: 'Option 1'
          },
          {
            value: 'Option 2'
          },
          {
            value: 'Option 3'
          }
        ],
        required: true,
        validate: [{ type: defaultValidatorTypes.REQUIRED }]
      }
    ]
  },
  initialValues: {
    'select-input': 'Option 1'
  }
};
WithRequiredValidation.play = async () => {
  const input = screen.getByText('Option 1');
  await userEvent.click(input);
  const blankOption = screen.getByRole('option', { name: '' });
  await userEvent.click(blankOption);
  await waitFor(async () => {
    await expect(screen.getByText('Required')).toBeInTheDocument();
  });
};
