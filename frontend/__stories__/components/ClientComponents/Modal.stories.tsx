import { GlobalModal } from '@/components/ClientComponents/Modal/Modal';
import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import { RefreshModalContent } from '@/providers/SessionTimeoutProvider';
import { Button, Grid, Typography } from '@mui/material';
import { expect, screen, userEvent, waitFor } from '@storybook/test';
import { type Meta } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';

const meta: Meta<typeof GlobalModal> = {
  title: 'Components/Client Components/Modal',
  component: GlobalModal,
  tags: ['autodocs'],
  parameters: {
    chromatic: { ignoreSelectors: ['h4'] }
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100%' }}>
        <SessionProvider>
          <ModalProvider>
            <Story />
          </ModalProvider>
        </SessionProvider>
      </div>
    )
  ]
};
export default meta;

export const Standard = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      'Example',
      <Grid>
        <Typography>Modal Content</Typography>
        <Button color='primary' onClick={closeModal}>
          Close
        </Button>
      </Grid>,
      closeModal
    );
  };

  return (
    <Button color='primary' onClick={onClick}>
      Open modal
    </Button>
  );
};

Standard.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText('Example')).toBeInTheDocument();
  });
};

export const NoCloseButton = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      'Example',
      <Grid>
        <Typography>Modal Content</Typography>
        <Button color='primary' onClick={closeModal}>
          Close
        </Button>
      </Grid>
    );
  };

  return (
    <Button color='primary' onClick={onClick}>
      Open modal
    </Button>
  );
};

NoCloseButton.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText('Example')).toBeInTheDocument();
  });
};

export const SessionTimeout = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      'Oh no! Your page will time out soon',
      <RefreshModalContent
        onExpiry={async () => {
          closeModal();
        }}
        expiryTime={Date.now() + 2 * 60000}
      />,
      closeModal
    );
  };

  return (
    <Button color='primary' onClick={onClick}>
      Open modal
    </Button>
  );
};
SessionTimeout.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText('Oh no! Your page will time out soon')).toBeInTheDocument();
  });
};
