import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { DDFStoryTemplate } from './DataDrivenFormStoryUtils';
import { RacwaRedirectEdit } from '@/components/DataDrivenForm/dynamic-components/RedirectEdit/RedirectEdit';

export default {
  title: 'Components/Data Driven Forms/Redirect Edit',
  component: RacwaRedirectEdit,
  tags: ['autodocs']
};

export const Default = DDFStoryTemplate.bind({});
Default.args = {
  schema: {
    fields: [
      {
        name: 'redirect',
        label: 'Label',
        content: 'Some data you can edit elsewhere',
        link: '#',
        component: racwaComponentTypes.REDIRECT_EDIT
      }
    ]
  }
};
