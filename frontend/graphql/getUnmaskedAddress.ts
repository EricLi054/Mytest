'use server';

import { getAccessToken } from '@/utilities/getAccessToken';
import { getServerSession } from 'next-auth';
import getData from './getData';
import { type PersonAddress } from '@/types/backendTypes/personAddress';

export interface UnmaskedAddressResponse {
  unmaskedPostalAddress: PersonAddress;
}
async function getUnmaskedAddress(): Promise<PersonAddress> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const token = await getAccessToken();
  const personAddressData: UnmaskedAddressResponse = await getData(
    `
      query GetUnmaskedAddress {
        unmaskedPostalAddress {
          formattedAddress
        }
      }
    `,
    token
  );

  return personAddressData.unmaskedPostalAddress;
}

export default getUnmaskedAddress;
