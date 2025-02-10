import { render, screen } from '@testing-library/react';
import DigitalCardMembershipButtonContent from './DigitalCardMembershipButtonContent';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { ModalProvider } from '../Modal/ModalProvider';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../Hooks/useDeviceDetection');

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('DigitalCardMembershipButtonContent', () => {
  beforeEach(() => {
    jest.resetModules();
  });

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

  it('renders add to wallet buttons in mobile view', () => {
    testHelper.mockMobileDevice();
    render(<DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />);

    expect(screen.getByAltText('Add to Apple Wallet')).toBeVisible();
    expect(screen.getByAltText('Add to Google Wallet')).toBeVisible();
  });

  it('renders find out more button in desktop view', () => {
    testHelper.mockDesktopDevice();
    render(<DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />);

    expect(screen.getByRole('button', { name: 'Find out more' })).toBeVisible();
  });

  it('clicks find out more button should show modal', async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />
      </ModalProvider>
    );

    await testHelper.clickButton('Find out more', screen);
    testHelper.verifyEventLogged('Find out more');
    testHelper.verifyEventLogged('Digital card desktop modal');
    expect(screen.getByText('Get your digital card now')).toBeVisible();
    await testHelper.clickButton('close', screen);
    testHelper.verifyEventLogged('Digital card desktop modal - Close');
    expect(screen.queryByText('Get your digital card now')).not.toBeInTheDocument();
  });
});
