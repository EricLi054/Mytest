"use server";

import type { VariablesOf } from "gql.tada";
import { headers } from "next/headers";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { annotatedLog } from "#utils/logging";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const { GRAPHQL_ENDPOINT } = serverEnv();

const query = graphql(`
  mutation MatchPerson($input: MatchInput!, $sessionKey: String!) {
    match(input: $input) {
      matchedPerson {
        personId
        racId
        firstName
        mobilePhone
        membershipType
        otpVerificationDetails(sessionKey: $sessionKey) {
          sessionKey
          isAuthenticated
          isMobile
          phoneNumberSuffix
        }
      }
      errors {
        type: __typename
      }
    }
  }
`);

export type GetMatchedPersonDataParams = VariablesOf<typeof query>;

export const getMatchedPersonData = async (variables: GetMatchedPersonDataParams) => {
  const token = await getAccessToken();
  const headerStore = await headers();
  const correlationId = crypto.randomUUID();

  annotatedLog(
    "getMatchedPersonData",
    `Starting to check for member match with CorrelationID [${correlationId}]`,
    variables.sessionKey,
  );

  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    token,
    query,
    sourceSystem: "identity",
    variables,
    headers: {
      CorrelationId: correlationId,
      // TODO - DED-1296 - What happens if User-Agent is undefined? RACI MFA OTP Service will error on verify. Should Person subgraph MFA Service throw exception?
      "User-Agent": headerStore.get("User-Agent") ?? "",
    },
  });
  return data;
};
