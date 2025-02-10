import { useLoadingContext } from '@/components/ClientComponents/Loading/LoadingContext';
import { LoadingProvider } from '@/components/ClientComponents/Loading/LoadingProvider';
import { LoadingScreen } from '@/components/ClientComponents/Loading/LoadingScreen';
import { Button } from '@mui/material';
import { type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';

const meta: Meta<typeof LoadingScreen> = {
  title: 'Components/Client Components/Loading',
  component: LoadingScreen,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LoadingProvider>
        <Story />
      </LoadingProvider>
    )
  ]
};
export default meta;

export const Standard = () => {
  const { openLoadingIndicator } = useLoadingContext();

  const onClick = () => {
    openLoadingIndicator();
  };

  return (
    <Button color='primary' onClick={onClick}>
      Open loading
    </Button>
  );
};

Standard.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
};

export const WithMessage = () => {
  const { openLoadingIndicator } = useLoadingContext();

  const onClick = () => {
    openLoadingIndicator('Loading message');
  };

  return (
    <Button color='primary' onClick={onClick}>
      Open loading
    </Button>
  );
};

WithMessage.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole('button');
  await userEvent.click(button);
};
