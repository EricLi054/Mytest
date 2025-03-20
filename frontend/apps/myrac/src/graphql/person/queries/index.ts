"use server";

import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { log, logError } from "#utils/logging";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { getPersonCache, upsertPersonCache } from "../cache";
import { RawPersonSchema } from "./schema";
import { transformPersonData } from "./util";

const query = graphql(`
  query GetPerson {
    me {
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
  }
`);

type GetPersonOptions = {
  mfaSessionKey?: string;
  overrideMasking?: boolean;
};

export const getPerson = async (providedOptions?: GetPersonOptions) => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getPerson-span");
  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();
    crmId = await getCrmId();

    let rawPerson = await getPersonCache();

    if (!rawPerson) {
      const token = await getAccessToken();

      if (!crmId) {
        throw new Error("No CRM ID found.");
      }

      log("getPerson", "Starting to fetch person data", correlationId, crmId);

      const rawData = await execute({
        endpoint: serverEnv().GRAPHQL_ENDPOINT,
        token,
        query,
        sourceSystem: "myRAC",
        variables: {},
        headers: { CorrelationId: correlationId },
      });

      ensureAuthenticatedResponse(rawData);

      rawPerson = RawPersonSchema.parse(rawData.data.me);

      await upsertPersonCache(rawPerson);
    }

    const options = providedOptions ?? { overrideMasking: false };

    let masked = !options.overrideMasking;
    if (options.mfaSessionKey) {
      const verificationDetails = await getOtpVerificationDetails(options.mfaSessionKey);
      masked = !verificationDetails.isAuthenticated;
    }

    return transformPersonData(rawPerson, masked);
  } catch (error) {
    logError(error, "getPerson", "Failed to fetch person data", correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
