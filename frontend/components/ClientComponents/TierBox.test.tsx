import { render, screen } from '@testing-library/react';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { TierBox } from './TierBox';

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

function getMockedPerson(): PersonInformation {
  return {
    title: 'Mr',
    firstName: 'Test',
    surname: 'Tester',
    racId: '12345678',
    cardColour: 'Blue',
    tier: 'Blue'
  };
}

describe('TierBox', () => {
  it('renders the component with correct member details', async () => {
    render(<TierBox person={getMockedPerson()} />);
    expect(screen.getByText('Blue member')).toBeInTheDocument();
  });

  it('clicks profile button triggers GA event', async () => {
    render(<TierBox person={getMockedPerson()} />);

    await testHelper.clickText('Blue member', screen);
    testHelper.verifyEventLogged('Digital card - Tier pill');
  });
});
