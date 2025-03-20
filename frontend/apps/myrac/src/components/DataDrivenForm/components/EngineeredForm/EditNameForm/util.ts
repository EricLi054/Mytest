"use server";

import { getCrmId } from "#utils/session/getCrmId";

// This logging function is to help with a Production problem where members are
// incorrectly changing their first name. This helps to link the change action selected
// to a members profile
export default async function logNameChangeEvent(log: string) {
  try {
    const crmId = await getCrmId();
    if (crmId) {
      console.log(`Name Change - ${crmId} - ${log}`);
    }
  } catch (e) {
    console.debug("Failed to log name change event.");
    console.debug(e);
  }
}
