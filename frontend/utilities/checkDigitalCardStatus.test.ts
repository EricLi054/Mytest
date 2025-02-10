import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import hasActiveDigitalCard from './checkDigitalCardStatus';

describe('checkDigitalCardStatus', () => {
  test('has no digital card details', async () => {
    const active = hasActiveDigitalCard(undefined);
    expect(active).toBeFalsy();
  });

  test('has no unsuccessful digital card details', async () => {
    const cardDetails: DigitalCardDetails = {
      isSuccess: false,
      value: {
        digitalCardPassId: '',
        digitalCardPassIsActive: false,
        digitalCardPassUrl: ''
      }
    };

    const active = hasActiveDigitalCard(cardDetails);
    expect(active).toBeFalsy();
  });

  test('does not have active digital card', async () => {
    const cardDetails: DigitalCardDetails = {
      isSuccess: true,
      value: {
        digitalCardPassId: 'abc123',
        digitalCardPassIsActive: false,
        digitalCardPassUrl: 'https://abc123.link'
      }
    };

    const active = hasActiveDigitalCard(cardDetails);
    expect(active).toBeFalsy();
  });

  test('does have active digital card', async () => {
    const cardDetails: DigitalCardDetails = {
      isSuccess: true,
      value: {
        digitalCardPassId: 'abc123',
        digitalCardPassIsActive: true,
        digitalCardPassUrl: 'https://abc123.link'
      }
    };

    const active = hasActiveDigitalCard(cardDetails);
    expect(active).toBeTruthy();
  });
});
