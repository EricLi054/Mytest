'use server';

import requestPhysicalCard from '@/graphql/requestPhysicalCard';
import ensureValidSession from '@/utilities/auth/ensureServerSession';
import { getAccessToken } from '@/utilities/getAccessToken';
import { getCrmId } from '@/utilities/getCrmId';

export type RequestPhysicalCardResponse = Awaited<ReturnType<typeof requestPhysicalCardHandler>>;

const requestPhysicalCardHandler = async () => {
  await ensureValidSession();
  const token = await getAccessToken();
  const crmId = await getCrmId();

  if (!crmId) {
    return {
      ok: false,
      message: 'No crmId found in session'
    };
  }

  const data = await requestPhysicalCard(crmId, token);

  if (!data || data?.physicalCardResponse?.errors) {
    console.error('Error: requestPhysicalCardHandler.js - Request physical card failed');

    return {
      ok: false,
      message: 'Error sending data'
    };
  }

  return {
    ok: !data.errors,
    data
  };
};

export default requestPhysicalCardHandler;
