import { render, screen } from '@testing-library/react';
import DigitalCardBack, { type DigitalCardBackProps } from './DigitalCardBack';

const props: DigitalCardBackProps = {
  membershipCardNumber: '2870603304236'
};

describe('DigitalCardBack', () => {
  it('should render details', async () => {
    render(<DigitalCardBack {...props} />);
    expect(screen.getByText('Scan and save')).toBeVisible();
    expect(screen.getByTestId('barcode')).toBeVisible();
  });
});
