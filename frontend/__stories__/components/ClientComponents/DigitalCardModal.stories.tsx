import { expect, screen, userEvent, waitFor } from '@storybook/test';
import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import { Button } from '@mui/material';
import { type Meta } from '@storybook/react';
import DigitalCardModalContent from '@/components/ClientComponents/DigitalCard/DigitalCardModalContent';
import { type PersonInformation } from '@/types/backendTypes/personInformation';

const meta: Meta<typeof DigitalCardModalContent> = {
  title: 'Components/Client Components/Digital Card Modal',
  component: DigitalCardModalContent,
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

const person: PersonInformation = {
  cardColour: 'Blue',
  membershipCardNumber: '1234567890123456',
  title: 'Mr',
  firstName: 'John',
  surname: 'Doe',
  tier: 'Gold Life',
  racId: '12345678'
};

export const Default = () => {
  const { openModal, closeModal } = useModalContext();
  return (
    <Button
      color='primary'
      onClick={() => {
        openModal(
          '',
          <DigitalCardModalContent addToWalletUrl='https://rac.com.au' person={person} />,
          closeModal,
          true
        );
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
    await expect(screen.getByText('Your digital card')).toBeInTheDocument();
  });
};
