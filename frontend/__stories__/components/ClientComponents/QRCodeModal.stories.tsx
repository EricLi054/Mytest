import { expect, screen, userEvent, waitFor } from '@storybook/test';
import QRCodeModalContent from '@/components/ClientComponents/DigitalCard/QRCodeModalContent';
import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import { Button } from '@mui/material';
import { type Meta } from '@storybook/react';

const meta: Meta<typeof QRCodeModalContent> = {
  title: 'Components/Client Components/QR Code Modal',
  component: QRCodeModalContent,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100%' }}>
        <ModalProvider>
          <Story />
        </ModalProvider>
      </div>
    )
  ]
};
export default meta;

export const Default = () => {
  const { openModal, closeModal } = useModalContext();
  return (
    <Button
      color='primary'
      onClick={() => {
        openModal('Get your digital card now', <QRCodeModalContent digitalCardUrl='https://rac.com.au' />, closeModal);
      }}
    >
      Open modal
    </Button>
  );
};

Default.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText('Get your digital card now')).toBeInTheDocument();
  });
};
