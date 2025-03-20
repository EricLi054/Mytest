"use server";

import { getRegistrationSession } from "#utils/session";

import type { Person } from "../types";

/**
 * Get the matched person in the registration session for the '/match' page.
 *
 * @returns Matched Person
 */
export async function getMatchedPerson(): Promise<Person> {
  const session = await getRegistrationSession({ currentPage: "/match" });

  if (!session.person) {
    throw new Error("Person does not exist on the registration session for the '/match' page");
  }

  return session.person;
}

/**
 * Get the CRM ID from the matched person in the registration session for the '/match' page.
 *
 * @returns CRM ID of Matched Person
 */
export async function getCrmId(): Promise<string> {
  const person = await getMatchedPerson();

  const crmId = person.personId;
  if (!crmId || crmId.trim() === "") {
    throw new Error("CRM ID is not defined on the Person in registration session for the '/match' page");
  }

  return crmId;
}
