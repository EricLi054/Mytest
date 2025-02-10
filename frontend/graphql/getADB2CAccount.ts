'use server';

import { getAccessToken } from '@/utilities/getAccessToken';
import { getServerSession } from 'next-auth';
import getData from './getData';
import { type ADB2CAccount } from '@/types/backendTypes/adb2cAccount';

async function getADB2CAccount(): Promise<ADB2CAccount> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const token = await getAccessToken();
  const adb2cData = await getData(
    `
      query {
        adb2CGraph {
          crmId
        }
      }
    `,
    token
  );

  return adb2cData.adb2CGraph;
}

export default getADB2CAccount;
