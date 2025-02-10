import DigitalCard, { type DigitalCardProps } from '@/components/ClientComponents/DigitalCard/DigitalCard';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import { type Meta } from '@storybook/react';

const meta: Meta<typeof DigitalCard> = {
  title: 'Components/Client Components/Digital Card',
  component: DigitalCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    )
  ]
};
export default meta;

const props: DigitalCardProps = {
  person: {
    cardColour: 'Blue',
    membershipCardNumber: '1234567890123456',
    title: 'Mr',
    firstName: 'John',
    surname: 'Doe',
    tier: 'Gold Life',
    racId: '12345678'
  },
  cardDetails: {
    isSuccess: true,
    value: {
      digitalCardPassId: '12345',
      digitalCardPassIsActive: true,
      digitalCardPassUrl: 'https://digital-card-link',
      numberOfPassesInstalled: 0
    },
    errors: null
  }
};

export const Default = () => {
  return <DigitalCard {...props} />;
};

export const WithPromoMessagingLeftAligned = () => {
  return (
    <div style={{ paddingTop: 100 }}>
      <DigitalCard {...props} storageKey='digital-card-counter' />
    </div>
  );
};

export const WithPromoMessagingRightAligned = () => {
  return (
    <div style={{ paddingTop: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <DigitalCard {...props} storageKey='digital-card-counter' />
    </div>
  );
};
