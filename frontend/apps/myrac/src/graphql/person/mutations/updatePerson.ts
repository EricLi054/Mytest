"use server";

import type { VariablesOf } from "gql.tada";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { invalidatePersonCache, upsertPersonCache } from "../cache";
import { RawPersonSchema } from "../queries/schema";

const query = graphql(`
  mutation UpdatePerson($person: UpdatePersonInput!) {
    updatePerson(input: $person) {
      person {
        title
        firstName
        middleName
        surname
        racId
        membershipCardNumber
        membershipType
        tier
        homePhone
        mobilePhone
        personalEmailAddress
        workPhone
        postalAddress {
          buildingName
          subBuildingNumber
          unitNumber
          lotNumber
          houseNumber
          poBox
          streetName
          suburb
          state
          postcode
        }
        digitalCardDetails {
          id
          passId
          isActive
          passUrl
          numberOfPassesInstalled
        }
      }
      errors {
        ... on ValidationError {
          __typename
          message
        }
      }
    }
  }
`);

export const updatePerson = async (variables: VariablesOf<typeof query>) => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("updatePerson-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("updatePerson", "Starting to update person", correlationId, crmId);

    const { firstName: _firstName, ...filteredRequest } = variables.person.request;

    const allowedUpdateVariables = {
      person: {
        request: {
          ...filteredRequest,
          postalAddress: {
            ...filteredRequest.postalAddress,
          },
        },
      },
    };

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: allowedUpdateVariables,
      headers: { CorrelationID: correlationId },
    });

    ensureAuthenticatedResponse(rawResponse);

    if (!rawResponse.errors && !rawResponse.data.updatePerson.errors && rawResponse.data.updatePerson.person !== null) {
      const { success, data } = RawPersonSchema.safeParse(rawResponse.data.updatePerson.person);

      if (!success) {
        return false;
      }

      const successfulCache = await upsertPersonCache(data);

      if (!successfulCache) {
        const cacheInvalidated = await invalidatePersonCache();

        if (!cacheInvalidated) {
          throw Error("Could not update the Person Cache.");
        }
      }

      return true;
    }

    return false;
  } catch (error) {
    logError(error, "updatePerson", "Failed to update person", correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
