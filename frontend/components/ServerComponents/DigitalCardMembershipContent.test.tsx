import { render, screen } from '@testing-library/react';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import DigitalCardMembershipContent from './DigitalCardMembershipContent';
import { EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';

library.add(fas);

describe('DigitalCardMembershipContent', () => {
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

  it('renders the page with correct member details', async () => {
    const mockPerson: PersonInformation = {
      racId: '12345678',
      cardColour: 'Blue',
      tier: 'Blue',
      membershipCardNumber: '1234567890123456'
    };

    render(
      <DigitalCardMembershipContent
        person={mockPerson}
        digitalCardDetails={mockedCardDetails}
        engineeredContent={new EngineeredContentCollection()}
      />
    );

    expect(screen.getByTestId('digital-card-front')).toBeVisible();
    expect(screen.getByText('Get your digital card')).toBeVisible();
    expect(screen.getByText('Always in your phone.')).toBeVisible();
    expect(screen.getByText('Easy to redeem discounts.')).toBeVisible();
  });
});
