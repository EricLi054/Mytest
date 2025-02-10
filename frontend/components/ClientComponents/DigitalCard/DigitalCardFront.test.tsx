import { render, screen } from '@testing-library/react';
import DigitalCardFront, { type DigitalCardFrontProps } from './DigitalCardFront';
import { testHelper } from '@/__tests__/helpers/testHelpers';

const props: DigitalCardFrontProps = {
  person: {
    firstName: 'Fiona',
    surname: 'Citizen',
    title: 'Ms',
    tier: 'Gold Life',
    racId: '018282922',
    membershipCardNumber: '1234567890123456',
    cardColour: 'Gold'
  }
};

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('DigitalCardFront', () => {
  it('should render details', async () => {
    render(<DigitalCardFront {...props} />);

    expect(screen.getByTestId('rac-logo')).toBeVisible();
    expect(screen.getByText('MS Fiona Citizen', { exact: false })).toBeVisible();
    expect(screen.getByText('Tier')).toBeVisible();
    expect(screen.getByText('Gold')).toBeVisible();
    expect(screen.getByText('Member number')).toBeVisible();
    expect(screen.getByText('018282922')).toBeVisible();
  });

  it('should uppercase display name', async () => {
    render(<DigitalCardFront {...props} />);

    expect(screen.getByText('MS Fiona Citizen', { exact: false })).toHaveStyle('text-transform: uppercase');
  });

  it('should fire event on click if passed', async () => {
    render(<DigitalCardFront {...props} googleAnalyticsDescription='Event' />);

    await testHelper.clickText('Gold', screen);
    testHelper.verifyEventLogged('Event');
  });
});
