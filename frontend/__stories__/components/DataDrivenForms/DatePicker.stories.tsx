import { expect, screen, userEvent, waitFor } from '@storybook/test';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import { DatePicker } from '@/components/DataDrivenForm/dynamic-components/DatePicker/DatePicker';
import defaultComponentTypes from '@/components/DataDrivenForm/dynamic-components/componentTypes';
import defaultValidatorTypes from '@/components/DataDrivenForm/validators/validatorTypes';
import racwaValidatorTypes from '@/components/DataDrivenForm/validators/racwaValidatorTypes';

export default {
  title: 'Components/Data Driven Forms/Date Picker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    chromatic: { ignoreSelectors: ['[data-testid="Date *-textInputField"]'] }
  }
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'date',
        label: 'Date',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.DATE_PICKER
      }
    ]
  }
};

export const WithInitialValue = DDFStoryTemplate.bind({});
WithInitialValue.args = {
  schema: {
    fields: [
      {
        name: 'date',
        label: 'Date',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.DATE_PICKER
      }
    ]
  },
  initialValues: {
    date: new Date(2000, 0, 1)
  }
};

export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: 'date',
        label: 'Date',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.DATE_PICKER,
        required: true,
        validate: [{ type: defaultValidatorTypes.REQUIRED }]
      }
    ]
  },
  initialValues: {
    date: new Date(2000, 0, 1)
  }
};
WithRequiredValidation.play = async () => {
  const input = screen.getByPlaceholderText('dd / mm / yyyy');
  await userEvent.click(input);
  const okButton = screen.queryByRole('button', { name: 'OK' });
  if (okButton) await userEvent.click(okButton);
  await userEvent.clear(input);
  await userEvent.click(document.body); // click away to trigger validation
  await waitFor(async () => {
    await expect(input).toBeInvalid();
  });
};

export const WithRangeValidation = DDFStoryTemplate.bind({});
WithRangeValidation.args = {
  schema: {
    fields: [
      {
        name: 'date',
        label: 'Date',
        disableGTM: true,
        helperText: 'Help text',
        component: defaultComponentTypes.DATE_PICKER,
        required: true,
        validate: [
          {
            type: racwaValidatorTypes.DATE_OF_BIRTH,
            ageOutOfRangeMessage: 'Age out of range',
            maxAge: 80,
            minAge: 16
          }
        ]
      }
    ]
  }
};
WithRangeValidation.play = async () => {
  // slighly different mobile and desktop behaviour to select a date
  const input = screen.getByPlaceholderText('dd / mm / yyyy');
  const button = screen.queryByRole('button', { name: 'Choose date' });
  await userEvent.click(button ?? input);
  await userEvent.keyboard('[Enter]');
  const okButton = screen.queryByRole('button', { name: 'OK' });
  if (okButton) await userEvent.click(okButton);
  await waitFor(async () => {
    await expect(input).toBeInvalid();
    await expect(screen.getByText('Age out of range')).toBeInTheDocument();
  });
};
