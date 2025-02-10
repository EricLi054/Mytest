import { render, screen } from '@testing-library/react';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { ModalProvider } from '../Modal/ModalProvider';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { PageImageTextCardAddToWallet } from './PageImageTextCardAddToWallet';

const mockedCardDetails: DigitalCardDetails = {
  isSuccess: true,
  value: {
    digitalCardPassId: '12345',
    digitalCardPassIsActive: true,
    digitalCardPassUrl: 'https://digital-card-link',
    numberOfPassesInstalled: 0
  },
  errors: null
};

jest.mock('../Hooks/useDeviceDetection');

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('PageImageTextCardAddToWallet', () => {
  it('should render the desktop link', async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <PageImageTextCardAddToWallet cardDetails={mockedCardDetails} />
      </ModalProvider>
    );

    expect(screen.getByText('Get a digital card now')).toBeVisible();
  });

  it('clicks the desktop link should show modal', async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <PageImageTextCardAddToWallet cardDetails={mockedCardDetails} />
      </ModalProvider>
    );

    await testHelper.clickText('Get a digital card now', screen);
    expect(screen.getByText('Get your digital card now')).toBeVisible();
    testHelper.verifyEventLogged('Get a digital card now');
  });

  it('should render the mobile buttons and faq link', async () => {
    testHelper.mockMobileDevice();
    render(
      <ModalProvider>
        <PageImageTextCardAddToWallet cardDetails={mockedCardDetails} />
      </ModalProvider>
    );
    expect(screen.getByRole('link', { name: 'Add to Apple Wallet' })).toHaveAttribute(
      'href',
      'https://digital-card-link'
    );
    expect(screen.getByRole('link', { name: 'Add to Google Wallet' })).toHaveAttribute(
      'href',
      'https://digital-card-link'
    );
    expect(screen.getByRole('link', { name: 'Frequently asked questions' })).toHaveAttribute('href', '/myrac/help');
  });
});
