import CardRequestSuccessPage from '@/components/ServerComponents/CardRequestSuccessPage';
import { EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { BLOCKS } from '@contentful/rich-text-types';
import { type ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { type CloudinaryImage } from '@/types/cmsTypes/CloudinaryImage';
import { Button } from '@mui/material';

export default {
  title: 'Components/Server Components/Card Request Success Page',
  component: CardRequestSuccessPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
};

const heading: ContentfulRichTextRendererProps = {
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
              value: 'John, your card will be on its way shortly',
              marks: [],
              data: {}
            }
          ]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'It will arrive within 10 days.',
              marks: [
                {
                  type: 'bold'
                }
              ],
              data: {}
            }
          ]
        }
      ]
    }
  }
};

const cardImage: CloudinaryImage[] = [
  {
    secure_url: 'https://res.rac.com.au/image/upload/f_auto/q_auto/v1728006683/myRAC/Digital_card_graphic_vlkiut.svg',
    publicId: 'myRAC/Digital_card_graphic_vlkiut',
    height: 85,
    width: 48
  }
];

const engineeredContent = new EngineeredContentCollection(
  { contentId: 'card-success-heading', richTextContent: heading.text },
  { contentId: 'card-success-heading-icon', iconContent: 'envelope' },
  { contentId: 'card-success-online-shop-card-icon', iconContent: 'clock' },
  { contentId: 'card-success-online-shop-card-title', stringContent: 'In the meantime...' },
  {
    contentId: 'card-success-digital-promo-card-image',
    imageContent: cardImage
  },
  {
    contentId: 'card-success-digital-promo-card-title',
    stringContent: 'Why not try a digital card?'
  },
  {
    contentId: 'card-success-digital-promo-card-content',
    stringContent: 'Easily redeem your discounts from your phone anytime.'
  }
);

const ProfileButtonOverride = () => (
  <Button fullWidth color='primary'>
    Profile
  </Button>
);

const MyRACButtonOverride = () => <Button fullWidth>myRAC homepage</Button>;

export const CardRequestSuccessNoDigitalCard = () => {
  return (
    <CardRequestSuccessPage
      MyRACButton={MyRACButtonOverride}
      ProfileButton={ProfileButtonOverride}
      engineeredContent={engineeredContent}
    />
  );
};

export const CardRequestSuccessDigitalCardDesktop = () => {
  return (
    <CardRequestSuccessPage
      MyRACButton={MyRACButtonOverride}
      ProfileButton={ProfileButtonOverride}
      digitalCardDetails={{
        isSuccess: true,
        value: {
          digitalCardPassId: '123',
          digitalCardPassIsActive: true,
          digitalCardPassUrl: 'https://digital-card',
          numberOfPassesInstalled: 0
        }
      }}
      engineeredContent={engineeredContent}
    />
  );
};

export const CardRequestSuccessDigitalCardMobile = () => {
  return (
    <CardRequestSuccessPage
      MyRACButton={MyRACButtonOverride}
      ProfileButton={ProfileButtonOverride}
      digitalCardDetails={{
        isSuccess: true,
        value: {
          digitalCardPassId: '123',
          digitalCardPassIsActive: true,
          digitalCardPassUrl: 'https://digital-card',
          numberOfPassesInstalled: 0
        }
      }}
      engineeredContent={engineeredContent}
    />
  );
};
CardRequestSuccessDigitalCardMobile.args = {
  useragent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1'
};
