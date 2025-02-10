import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import EngineeredMembershipPage from '@/components/ServerComponents/EngineeredMembershipPage';
import { type ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

export default {
  title: 'Components/Server Components/Membership Page',
  component: EngineeredMembershipPage,
  tags: ['autodocs']
};

const title: ContentfulRichTextRendererProps = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Membership',
              marks: [],
              data: {}
            }
          ]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            { nodeType: 'text', value: '', marks: [], data: {} },
            {
              // Storybook cannot call backend graphql to fetch the contentful
              // data, changing nodeType to normal hyperlink to render it.
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://rac.com.au'
              },
              content: [
                {
                  nodeType: 'text',
                  value: '< Profile',
                  marks: [],
                  data: {}
                }
              ]
            },
            { nodeType: 'text', value: '', marks: [], data: {} }
          ]
        }
      ]
    }
  }
};

const requestCardLink: ContentfulRichTextRendererProps = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            { nodeType: 'text', value: '', marks: [], data: {} },
            {
              // Storybook cannot call backend graphql to fetch the contentful
              // data, changing nodeType to normal hyperlink to render it.
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://rac.com.au'
              },
              content: [
                {
                  nodeType: 'text',
                  value: 'Request a plastic card',
                  marks: [],
                  data: {}
                }
              ]
            },
            { nodeType: 'text', value: '', marks: [], data: {} }
          ]
        }
      ]
    }
  }
};

const engineeredContent = new EngineeredContentCollection(
  { contentId: 'membership-title', richTextContent: title.text },
  { contentId: 'membership-request-card-link', richTextContent: requestCardLink.text }
);

export const MembershipPageDetails = () => {
  return (
    <EngineeredMembershipPage
      person={{
        racId: '12345678',
        cardColour: 'Gold',
        tier: 'Gold',
        membershipCardNumber: '1234567890123456'
      }}
      engineeredContent={engineeredContent}
    />
  );
};

export const MembershipPageDetailsWithDigitalCard = () => {
  return (
    <ModalProvider>
      <EngineeredMembershipPage
        person={{
          firstName: 'Test',
          surname: 'Tester',
          racId: '12345678',
          cardColour: 'Gold',
          tier: 'Gold',
          membershipCardNumber: '1234567890123456'
        }}
        digitalCardDetails={{
          isSuccess: true,
          value: {
            digitalCardPassId: '12345',
            digitalCardPassIsActive: true,
            digitalCardPassUrl: 'https://digital-card-link',
            numberOfPassesInstalled: 0
          },
          errors: null
        }}
        engineeredContent={engineeredContent}
      />
    </ModalProvider>
  );
};
