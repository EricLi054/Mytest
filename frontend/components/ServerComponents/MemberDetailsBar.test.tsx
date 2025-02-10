import { render, screen } from '@testing-library/react';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import MemberDetailsBar from './MemberDetailsBar';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import hasActiveDigitalCard from '@/utilities/checkDigitalCardStatus';

library.add(fas);

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

jest.mock('../../utilities/checkDigitalCardStatus', () => jest.fn());

function getMockedPerson(): PersonInformation {
  return {
    title: 'Mr',
    firstName: 'Test',
    surname: 'Tester',
    racId: '12345678',
    cardColour: 'Blue',
    tier: 'Blue',
    membershipCardNumber: '12345678888888888'
  };
}

describe('MemberDetailsBar', () => {
  it('renders the component with correct member details', async () => {
    render(<MemberDetailsBar person={getMockedPerson()} />);

    expect(screen.getByText('Mr T Tester')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Blue member')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
  });

  it('clicks profile button triggers GA event', async () => {
    render(<MemberDetailsBar person={getMockedPerson()} />);

    await testHelper.clickLink('Profile', screen);
    testHelper.verifyEventLogged('Digital card - Profile button click');
  });

  function getMockedDigitalCardDetails(): DigitalCardDetails {
    return {
      isSuccess: true,
      value: {
        digitalCardPassId: '123',
        digitalCardPassIsActive: true,
        digitalCardPassUrl: 'https://abc123.com',
        numberOfPassesInstalled: 0
      },
      errors: null
    };
  }

  it('renders digital card if active', async () => {
    jest.mocked(hasActiveDigitalCard).mockReturnValueOnce(true);
    render(<MemberDetailsBar person={getMockedPerson()} digitalCardDetails={getMockedDigitalCardDetails()} />);

    const cardImage = screen.getByText('Digital card');
    expect(cardImage).toBeVisible();
  });

  it('clicks Digital Card Icon triggers GA event when digitalCardPassIsActive is `false`', async () => {
    jest.mocked(hasActiveDigitalCard).mockReturnValueOnce(false);
    render(<MemberDetailsBar person={getMockedPerson()} digitalCardDetails={getMockedDigitalCardDetails()} />);

    await testHelper.clickTestId('digital-card-icon', screen);
    testHelper.verifyEventLogged('Digital card icon click');
  });
});
