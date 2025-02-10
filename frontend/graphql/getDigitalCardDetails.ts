import { getAccessToken } from '@/utilities/getAccessToken';
import { getServerSession } from 'next-auth';
import getData from './getData';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';

const query = `
query getDigitalCardDetails {
  digitalCardDetails {
    isSuccess
    value {
      digitalCardPassId
      digitalCardPassIsActive
      digitalCardPassUrl
      numberOfPassesInstalled
      id
    }
    errors
  }
}
`;

interface DigitalCardDetailsResponse {
  digitalCardDetails: DigitalCardDetails;
}

const getDigitalCardDetails = async (): Promise<DigitalCardDetails | undefined> => {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const token = await getAccessToken();
  const data: DigitalCardDetailsResponse = await getData(query, token);

  if (!data?.digitalCardDetails) {
    console.error('Error: retrieve digital card details failed with no result');
    return undefined;
  }

  return data.digitalCardDetails;
};

export default getDigitalCardDetails;
