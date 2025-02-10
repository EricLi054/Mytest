import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import NameChangeConfirmationContent from '@/components/DataDrivenForm/engineered-forms/NameChangeConfirmationContent';
import { Button } from '@mui/material';
import { type Meta } from '@storybook/react';
import { screen, userEvent, waitFor, expect } from '@storybook/test';

const meta: Meta<typeof NameChangeConfirmationContent> = {
  title: 'Components/Data Driven Forms/Name Change Confirmation',
  component: NameChangeConfirmationContent,
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
        openModal(
          'Your first name is important',
          <NameChangeConfirmationContent
            onConfirm={async () => {
              closeModal();
            }}
            onCancel={closeModal}
            logNameChangeEvent={async (event: string) => {
              console.log(event);
            }}
          />,
          closeModal
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
    await expect(screen.getByText('Your first name is important')).toBeInTheDocument();
  });
};
