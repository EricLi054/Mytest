"use server";

import { getRegistrationSession } from "#utils/session";

/**
 * Get the CRM ID from the matched person in the registration session for the '/match' page.
 *
 * @returns CRM ID of Matched Person
 */
export async function getCrmId(): Promise<string> {
  const session = await getRegistrationSession({ currentPage: "/match" });

  const person = session.person;
  if (!person) {
    throw new Error("Person does not exist on the registration session");
  }

  const crmId = person.personId;
  if (!crmId || crmId.trim() === "") {
    throw new Error("CRM ID is not defined on the Person in registration session for the '/match' page");
  }

  return crmId;
}

/**
 * Get the MFA Session Key and the CRM ID from the matched
 * person in the registration session for the '/match' page.
 *
 * @returns MFA Session Key and CRM ID of Matched Person
 */
export async function getMfaSessionKeyAndCrmId(): Promise<[string, string]> {
  const session = await getRegistrationSession({ currentPage: "/match" });

  const mfaSessionKey = session.mfaSessionKey;
  if (!mfaSessionKey || mfaSessionKey.trim() === "") {
    throw new Error("MFA Session Key does not exist on the registration session");
  }

  if (!session.person) {
    throw new Error("Person does not exist on the registration session for the '/match' page");
  }

  const crmId = session.person.personId;
  if (!crmId || crmId.trim() === "") {
    throw new Error("CRM ID is not defined on the Person in registration session for the '/match' page");
  }

  return [mfaSessionKey, crmId];
}
