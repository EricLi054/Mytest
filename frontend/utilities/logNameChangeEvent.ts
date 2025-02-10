'use server';

import { getCrmId } from './getCrmId';

// This logging function is to help with a Production problem where members are
// incorrectly changing their first name. This helps to link the change action selected
// to a members profile
export default async function logNameChangeEvent(log: string) {
  const crmId = await getCrmId();
  if (crmId) console.log(`${crmId} - ${log}`);
}
