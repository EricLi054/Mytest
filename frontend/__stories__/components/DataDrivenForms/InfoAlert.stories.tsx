import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import { RacwaInfoAlert } from '@/components/DataDrivenForm/dynamic-components/InfoAlert/InfoAlert';

export default {
  title: 'Components/Data Driven Forms/Info Alert',
  component: RacwaInfoAlert,
  tags: ['autodocs']
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'info',
        label: 'Header',
        helperText: 'Body',
        component: racwaComponentTypes.INFO_ALERT
      }
    ]
  }
};

const richText = {
  json: {
    data: {},
    content: [
      {
        data: {},
        content: [
          {
            data: {},
            marks: [
              {
                type: 'bold'
              }
            ],
            value: 'Example rich text heading',
            nodeType: 'text'
          }
        ],
        nodeType: 'paragraph'
      },
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: 'subheading',
            nodeType: 'text'
          }
        ],
        nodeType: 'paragraph'
      }
    ],
    nodeType: 'document'
  }
};

export const WithRichTextHeading = DDFStoryTemplate.bind({});
WithRichTextHeading.args = {
  schema: {
    fields: [
      {
        name: 'info',
        richText,
        helperText: 'Body',
        component: racwaComponentTypes.INFO_ALERT
      }
    ]
  }
};
