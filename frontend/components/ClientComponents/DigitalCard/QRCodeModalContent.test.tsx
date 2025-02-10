import { render, screen } from '@testing-library/react';
import QRCodeModalContent from './QRCodeModalContent';

describe('QRCodeModalContent', () => {
  it('renders the modal content with rendered qr code', async () => {
    render(<QRCodeModalContent digitalCardUrl='https://digital-card-url' />);

    expect(screen.getByText('To add to your mobile wallet')).toBeVisible();
    const qrcode = screen.getByRole('img', { name: 'Get your digital card' });
    expect(qrcode).toBeVisible();
  });
});
