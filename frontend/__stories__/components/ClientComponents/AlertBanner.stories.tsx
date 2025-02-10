import AlertBanner from '@/components/ClientComponents/AlertBanner';
import { BLOCKS } from '@contentful/rich-text-types';

export default {
  title: 'Components/Client Components/Alert Banner',
  component: AlertBanner,
  tags: ['autodocs']
};

export const SingleBanner = () => {
  return (
    <AlertBanner
      bannerAlert={{
        title: 'Example Banner',
        icon: 'exclamation-triangle',
        bodyText: {
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value: 'This is an alert banner',
                    marks: [],
                    data: {}
                  }
                ]
              }
            ]
          }
        }
      }}
    />
  );
};
