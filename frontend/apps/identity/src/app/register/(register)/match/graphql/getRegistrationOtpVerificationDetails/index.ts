"use server";

import { headers } from "next/headers";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { annotatedError, annotatedLog } from "#utils/logging";
import { graphql } from "gql.tada";

import type { OtpVerificationDetails } from "@racwa/mfa/types";
import { execute } from "@racwa/gql";

import { getMfaSessionKeyAndCrmId } from "../../utils/mfa";
import { schema } from "./schema";

const query = graphql(`
  mutation GetRegistrationOtpVerificationDetails($key: String!, $crmId: String!) {
    registrationOtpVerificationDetails(key: $key, crmId: $crmId) {
      isAuthenticated
      isMobile
      phoneNumberSuffix
    }
  }
`);

export const getRegistrationOtpVerificationDetails = async (): Promise<OtpVerificationDetails> => {
  let key: string | undefined;
  let crmId: string | undefined;

  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("get-registration-otp-verification-details-gql-span");
  const correlationId = crypto.randomUUID();

  try {
    // await ensureServerSession(); // TODO - DED-2331 - myRAC does this, but it is always returning null session here and in the root layout
    [key, crmId] = await getMfaSessionKeyAndCrmId();
    const token = await getAccessToken();
    const headerStore = await headers();

    annotatedLog(
      "getRegistrationOtpVerificationDetails",
      `Starting to get registration OTP verification details with CorrelationID [${correlationId}]`,
      key,
      crmId,
    );

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "identity",
      variables: { key, crmId },
      headers: {
        CorrelationId: correlationId,
        // TODO - DED-1296 - What happens if User-Agent is undefined? RACI MFA OTP Service will error on verify. Should Person subgraph MFA Service throw exception?
        "User-Agent": headerStore.get("User-Agent") ?? "",
      },
    });

    // GetRegistrationOtpVerificationDetails Mutation does not currently return any Error types
    if (!rawResponse.data.registrationOtpVerificationDetails) {
      if (rawResponse.errors?.[0]) {
        throw new Error(rawResponse.errors[0].message);
      }
      throw new Error("Unhandled Exception");
    }

    const validatedResponse = schema.parse(rawResponse.data.registrationOtpVerificationDetails);

    return { sessionKey: key, ...validatedResponse };
  } catch (error) {
    annotatedError(
      "getRegistrationOtpVerificationDetails",
      `Failed to get registration OTP verification details with CorrelationID [${correlationId}]`,
      error,
      key,
      crmId,
    );
    throw error;
  } finally {
    span.end();
  }
};
