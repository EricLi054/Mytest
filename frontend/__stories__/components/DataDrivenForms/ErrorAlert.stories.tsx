import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import { RacwaErrorAlert } from '@/components/DataDrivenForm/dynamic-components/ErrorAlert/ErrorAlert';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { type ReactNode } from 'react';
import { Button } from '@mui/material';
import { screen, userEvent } from '@storybook/test';

export default {
  title: 'Components/Data Driven Forms/Error Alert',
  component: RacwaErrorAlert,
  tags: ['autodocs']
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'error-alert',
        label: 'Error',
        disableGTM: true,
        component: racwaComponentTypes.ERROR_ALERT,
        errorType: 'test-error',
        helperText: 'Body'
      }
    ]
  },
  onSubmit: () => {
    return {
      ok: false,
      data: {
        errors: [
          {
            extensions: { type: 'test-error' }
          }
        ]
      }
    };
  },
  template: ({ formFields }) => {
    const { handleSubmit } = useFormApi();
    return (
      <form onSubmit={handleSubmit}>
        {formFields as ReactNode}
        <Button type='submit'>Submit</Button>
      </form>
    );
  }
};

Default.play = async () => {
  const button: HTMLButtonElement = screen.getByRole('button');
  await userEvent.click(button);
};
