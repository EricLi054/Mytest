'use server';

import { getAccessToken } from '@/utilities/getAccessToken';
import { getServerSession } from 'next-auth';
import getData from './getData';
import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import { type PersonInformation } from '@/types/backendTypes/personInformation';

async function getContactDetailsMetadata(): Promise<{ person: PersonInformation; b2cUrl: string }> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const token = await getAccessToken();
  const personData = await getData(
    `
      query {
        person(sessionKey: "${MFAJourneyKeys.manageContact}") {
          racId
          tier
          cardColour
          homePhone
          mobilePhone
          personalEmailAddress
          workPhone
          postalAddress {
            formattedAddress
          }
        }
      }
    `,
    token
  );

  return { person: personData.person, b2cUrl: process.env.INSURANCE_B2C_URL ?? '' };
}

export default getContactDetailsMetadata;
