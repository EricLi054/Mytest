"use server";

import type { VariablesOf } from "gql.tada";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { annotatedError, annotatedLog } from "#utils/logging";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  mutation MatchPerson($input: MatchInput!) {
    match(input: $input) {
      matchedPerson {
        personId
        racId
        firstName
        mobilePhone
        membershipType
      }
      errors {
        type: __typename
      }
    }
  }
`);

export type GetMatchedPersonDataParams = VariablesOf<typeof query>;

export const getMatchedPersonData = async (variables: GetMatchedPersonDataParams) => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("get-matched-person-data-gql-span");
  const correlationId = crypto.randomUUID();

  try {
    const token = await getAccessToken();

    annotatedLog("getMatchedPersonData", `Starting to check for member match with CorrelationID [${correlationId}]`);

    const data = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "identity",
      variables,
      headers: {
        CorrelationId: correlationId,
      },
    });

    return data;
  } catch (error) {
    annotatedError(
      "getMatchedPersonData",
      `Failed to check for member match with CorrelationID [${correlationId}]`,
      error,
    );
    throw error;
  } finally {
    span.end();
  }
};
