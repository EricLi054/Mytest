import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import { RacwaFixedLabelPlainText } from '@/components/DataDrivenForm/dynamic-components/FixedLabelPlainText/FixedLabelPlainText';

export default {
  title: 'Components/Data Driven Forms/Fixed Sized Label',
  component: RacwaFixedLabelPlainText,
  tags: ['autodocs']
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'fixed',
        label: 'Mobile 12345678',
        fixedLabelWidth: '200px',
        component: racwaComponentTypes.FIXED_LABEL_PLAIN_TEXT
      }
    ]
  }
};

export const WithStyling = DDFStoryTemplate.bind({});
WithStyling.args = {
  schema: {
    fields: [
      {
        name: 'title',
        label: 'Home 12345678',
        fixedLabelWidth: '100px',
        sx: {
          fontWeight: 'bold'
        },
        component: racwaComponentTypes.FIXED_LABEL_PLAIN_TEXT
      }
    ]
  }
};
