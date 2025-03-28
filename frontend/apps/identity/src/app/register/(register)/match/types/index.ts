import type { PickFromQuery } from "@racwa/types";

import type { getMatchedPersonData } from "../data";

export const IdentificationMethod = {
  Mobile: "mobile",
  Membership: "membership",
  Policy: "policy",
} as const;

export type IdentificationMethodValue = (typeof IdentificationMethod)[keyof typeof IdentificationMethod];

export type Person = {
  personId: string;
  racId: string;
  firstName: string;
  mobilePhone: string | null;
  membershipType: string | null;
};

export type MatchResponse = {
  status: number;
  person: Person | undefined;
};

export type PersonMatchError = PickFromQuery<typeof getMatchedPersonData, "match.errors">[number]["type"];

export const LapsedMembershipStatus = "Non-Member";
