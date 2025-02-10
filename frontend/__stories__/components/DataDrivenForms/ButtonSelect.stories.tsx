import { RacwaButtonSelect } from '@/components/DataDrivenForm/dynamic-components/ButtonSelect/ButtonSelect';
import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import defaultValidatorTypes from '@/components/DataDrivenForm/validators/validatorTypes';

export default {
  title: 'Components/Data Driven Forms/Button Select',
  component: RacwaButtonSelect,
  tags: ['autodocs']
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'title',
        label: 'Title',
        helperText: 'Help text',
        disableGTM: true,
        fullWidth: true,
        component: racwaComponentTypes.BUTTON_SELECT,
        options: [
          {
            value: 'Mr'
          },
          {
            value: 'Mrs'
          },
          {
            value: 'Miss'
          },
          {
            value: 'Ms'
          },
          {
            value: 'Mx'
          },
          {
            value: 'Dr'
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
        name: 'title',
        label: 'Title',
        helperText: 'Help text',
        disableGTM: true,
        fullWidth: true,
        component: racwaComponentTypes.BUTTON_SELECT,
        options: [
          {
            value: 'Mr'
          },
          {
            value: 'Mrs'
          },
          {
            value: 'Miss'
          },
          {
            value: 'Ms'
          },
          {
            value: 'Mx'
          },
          {
            value: 'Dr'
          }
        ]
      }
    ]
  },
  initialValues: {
    title: 'Miss'
  }
};

export const WithRequiredValidation = DDFStoryTemplate.bind({});
WithRequiredValidation.args = {
  schema: {
    fields: [
      {
        name: 'title',
        label: 'Title',
        helperText: 'Help text',
        disableGTM: true,
        fullWidth: true,
        component: racwaComponentTypes.BUTTON_SELECT,
        options: [
          {
            value: 'Mr'
          },
          {
            value: 'Mrs'
          },
          {
            value: 'Miss'
          },
          {
            value: 'Ms'
          },
          {
            value: 'Mx'
          },
          {
            value: 'Dr'
          }
        ],
        required: true,
        validate: [{ type: defaultValidatorTypes.REQUIRED }]
      }
    ]
  }
};
// TODO: Is there a way to clear this components value
