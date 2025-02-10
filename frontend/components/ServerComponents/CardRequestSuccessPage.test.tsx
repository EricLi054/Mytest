import { render, screen } from '@testing-library/react';
import CardRequestSuccessPage from './CardRequestSuccessPage';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { BLOCKS } from '@contentful/rich-text-types';
import { type ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ModalProvider } from '../ClientComponents/Modal/ModalProvider';

library.add(faEnvelope);

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

jest.mock('../ClientComponents/Hooks/useDeviceDetection');

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
              marks: [],
              data: {}
            }
          ]
        }
      ]
    }
  }
};

const engineeredContent = new EngineeredContentCollection(
  { contentId: 'card-success-heading', richTextContent: heading.text },
  { contentId: 'card-success-heading-icon', iconContent: 'envelope' },
  { contentId: 'card-success-online-shop-card-icon', iconContent: 'clock' },
  { contentId: 'card-success-online-shop-card-title', stringContent: 'In the meantime...' },
  {
    contentId: 'card-success-digital-promo-card-title',
    stringContent: 'Why not try a digital card?'
  },
  {
    contentId: 'card-success-digital-promo-card-content',
    stringContent: 'Easily redeem your discounts from your phone anytime.'
  }
);

describe('Card Request Success Page', () => {
  it('renders the page with correct member details', async () => {
    render(<CardRequestSuccessPage engineeredContent={engineeredContent} />);

    expect(screen.getByText('John, your card will be on its way shortly')).toBeVisible();
  });

  it('renders inactive digital card content and check GA events', async () => {
    render(<CardRequestSuccessPage engineeredContent={engineeredContent} />);

    expect(screen.getByText('John, your card will be on its way shortly')).toBeVisible();
    expect(screen.getByText('In the meantime...')).toBeVisible();
    testHelper.verifyEventLogged('Member Central - Digital pass inactive');
  });

  it('Logs GA event on Online Shop Link Click', async () => {
    render(<CardRequestSuccessPage engineeredContent={engineeredContent} />);

    const onlineShopLink = screen.getByRole('link', { name: 'online shop' });
    expect(onlineShopLink).toBeVisible();
    expect(onlineShopLink).toHaveAttribute('href', 'https://store.rac.com.au');

    await testHelper.clickLink('online shop', screen);
    testHelper.verifyEventLogged('Redeem discounts in the online shop');
  });

  it('renders active digital card promo for desktop', async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <CardRequestSuccessPage
          engineeredContent={engineeredContent}
          digitalCardDetails={{
            isSuccess: true,
            value: {
              digitalCardPassId: '123',
              digitalCardPassIsActive: true,
              digitalCardPassUrl: 'https://digital-card',
              numberOfPassesInstalled: 0
            }
          }}
        />
      </ModalProvider>
    );

    expect(screen.getByText('John, your card will be on its way shortly')).toBeVisible();
    expect(screen.getByText('Why not try a digital card?')).toBeVisible();
    expect(screen.getByText('Get a digital card now')).toBeVisible();
    await testHelper.clickText('Get a digital card now', screen);
    expect(screen.getByText('Get your digital card')).toBeInTheDocument();
  });

  it('renders active digital card promo for mobile', async () => {
    testHelper.mockMobileDevice();
    render(
      <CardRequestSuccessPage
        engineeredContent={engineeredContent}
        digitalCardDetails={{
          isSuccess: true,
          value: {
            digitalCardPassId: '123',
            digitalCardPassIsActive: true,
            digitalCardPassUrl: 'https://digital-card',
            numberOfPassesInstalled: 0
          }
        }}
      />
    );

    expect(screen.getByText('John, your card will be on its way shortly')).toBeVisible();
    expect(screen.getByText('Why not try a digital card?')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Add to Apple Wallet' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Add to Google Wallet' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Frequently asked questions' })).toBeVisible();
  });
});
