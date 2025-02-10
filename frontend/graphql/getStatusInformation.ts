'use server';

import { getAccessToken } from '@/utilities/getAccessToken';
import getData from './getData';
import { type StatusInformation } from '@/types/backendTypes/statusInformation';
import { getServerSession } from 'next-auth';

async function getStatusInformation(): Promise<StatusInformation[] | null> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const token = await getAccessToken();
  const data = await getData(
    `
      query {
        statusInformation {
          name
          status
        }
      }
    `,
    token
  );

  if (!data?.statusInformation || data.errors) {
    return null;
  }

  return data.statusInformation;
}

export default getStatusInformation;
