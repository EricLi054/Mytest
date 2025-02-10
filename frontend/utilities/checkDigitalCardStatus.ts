import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';

export default function hasActiveDigitalCard(cardDetails: DigitalCardDetails | undefined): boolean {
  return cardDetails ? cardDetails.isSuccess && cardDetails.value.digitalCardPassIsActive : false;
}
