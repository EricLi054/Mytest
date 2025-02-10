import { render, screen, fireEvent } from '@testing-library/react';
import DigitalCardModalContent from './DigitalCardModalContent';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { testHelper } from '@/__tests__/helpers/testHelpers';

const mockPerson: PersonInformation = {
  firstName: 'Fiona',
  surname: 'Citizen',
  title: 'Ms',
  tier: 'Gold Life',
  racId: '018282922',
  membershipCardNumber: '1234567890123456'
};

const mockAddToWalletUrl = 'https://example.com';

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('DigitalCardModalContent', () => {
  it('renders the modal content with person information', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText('Your digital card')).toBeVisible();
    expect(screen.getByText('Use the barcode or set up your card in your digital wallet')).toBeVisible();
  });

  it('renders the DigitalCardFront component initially', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText('Show barcode')).toBeVisible();
    expect(screen.queryByText('Hide barcode')).toBeNull();
  });

  it('toggles to show DigitalCardBack when "Show barcode" is clicked', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    const toggleButton = screen.getByText('Show barcode');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Hide barcode')).toBeVisible();
    expect(screen.queryByText('Show barcode')).toBeNull();
  });

  it('toggles to show DigitalCardBack when card is left swiped', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    const card = screen.getByTestId('flippable-card');

    fireEvent.touchStart(card, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchMove(card, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchEnd(card);

    expect(screen.getByText('Hide barcode')).toBeVisible();
    expect(screen.queryByText('Show barcode')).toBeNull();

    testHelper.verifyEventLogged('Digital card mobile modal - Swipe to show barcode');
  });

  it('toggles to show DigitalCardFront when card is right swiped from back', async () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    await testHelper.clickText('Show barcode', screen);

    expect(screen.getByText('Hide barcode')).toBeVisible();
    expect(screen.queryByText('Show barcode')).toBeNull();

    const card = screen.getByTestId('flippable-card');

    fireEvent.touchStart(card, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchMove(card, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchEnd(card);
    expect(screen.getByText('Show barcode')).toBeVisible();
    expect(screen.queryByText('Hide barcode')).toBeNull();

    testHelper.verifyEventLogged('Digital card mobile modal - Swipe to hide barcode');
  });

  it('hides "Show Barcode" button when barcode is undefined', () => {
    render(
      <DigitalCardModalContent
        person={{ ...mockPerson, membershipCardNumber: undefined }}
        addToWalletUrl={mockAddToWalletUrl}
      />
    );
    expect(screen.queryByText('Show barcode')).toBeNull();
  });

  it('renders AddToAppleWalletButton and AddToGoogleWalletButton', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.queryByRole('link', { name: /Add to Apple Wallet/i })).toBeVisible();
    expect(screen.queryByRole('link', { name: /Add to Google Wallet/i })).toBeVisible();
  });

  it('clicking AddToAppleWalletButton and AddToGoogleWalletButton fires events', async () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    await testHelper.clickLink('Add to Apple Wallet', screen);
    testHelper.verifyEventLogged('Digital card mobile modal - Add to Apple Wallet');
    await testHelper.clickLink('Add to Google Wallet', screen);
    testHelper.verifyEventLogged('Digital card mobile modal - Add to Google Wallet');
  });

  it('hides AddToAppleWalletButton and AddToGoogleWalletButton when no addToWalletUrl is provided', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={undefined} />);

    expect(screen.queryByRole('link', { name: /Add to Apple Wallet/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /Add to Google Wallet/i })).toBeNull();
  });

  it('renders the footer link', () => {
    render(<DigitalCardModalContent person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText('Frequently asked questions')).toBeVisible();
    expect(screen.getByRole('link', { name: /Frequently asked questions/i })).toHaveAttribute('href', '/myrac/help');
  });

  it('does not render content if person information is not provided', () => {
    const { container } = render(<DigitalCardModalContent person={undefined} addToWalletUrl={mockAddToWalletUrl} />);
    expect(container).toBeEmptyDOMElement();
  });
});
