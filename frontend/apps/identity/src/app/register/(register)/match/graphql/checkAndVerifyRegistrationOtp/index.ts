"use server";

import { headers } from "next/headers";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { annotatedError, annotatedLog } from "#utils/logging";
import { getNpeFeatureHeaders } from "#utils/npe";
import { graphql } from "gql.tada";

import type { CheckAndVerifyOtpResponse } from "@racwa/mfa/types";
import { execute } from "@racwa/gql";

import { getCrmId } from "../../utils/mfa";
import { schema } from "./schema";

const query = graphql(`
  mutation CheckAndVerifyRegistrationOtp($input: CheckAndVerifyRegistrationOtpInput!) {
    checkAndVerifyRegistrationOtp(input: $input) {
      verifyOtpResponse {
        isVerified
      }
      errors {
        ... on TooManyRequestsError {
          __typename
        }
        ... on NotFoundError {
          __typename
        }
        ... on InternalServerError {
          __typename
        }
      }
    }
  }
`);

export const checkAndVerifyRegistrationOtp = async (key: string, code: string): Promise<CheckAndVerifyOtpResponse> => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("check-and-verify-registration-otp-gql-span");
  const correlationId = crypto.randomUUID();
  const crmId = await getCrmId();

  try {
    // await ensureServerSession(); // TODO - DED-2331 - myRAC does this, but it is always returning null session here and in the root layout
    const token = await getAccessToken();
    const headerStore = await headers();
    const npeFeatureHeaders = await getNpeFeatureHeaders(correlationId);

    annotatedLog(
      "checkAndVerifyRegistrationOtp",
      `Starting to check and verify registration OTP with CorrelationID [${correlationId}]`,
      key,
      crmId,
    );

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "identity",
      variables: { input: { key, crmId, code } },
      headers: {
        CorrelationId: correlationId,
        // TODO - DED-1296 - What happens if User-Agent is undefined? RACI MFA OTP Service will error on verify. Should Person subgraph MFA Service throw exception?
        "User-Agent": headerStore.get("User-Agent") ?? "",
        ...npeFeatureHeaders,
      },
    });

    if (rawResponse.errors) {
      throw new Error("Unhandled Exception");
    }

    const validatedResponse = schema.parse(rawResponse.data);

    if (validatedResponse.checkAndVerifyRegistrationOtp.verifyOtpResponse) {
      return { data: validatedResponse.checkAndVerifyRegistrationOtp.verifyOtpResponse };
    }

    if (
      validatedResponse.checkAndVerifyRegistrationOtp.errors &&
      validatedResponse.checkAndVerifyRegistrationOtp.errors.length === 1
    ) {
      const errorCode = validatedResponse.checkAndVerifyRegistrationOtp.errors[0]?.__typename;

      if (errorCode === "TooManyRequestsError" || errorCode === "NotFoundError") {
        return {
          errorCode,
        };
      }
    }

    throw new Error("Unhandled Exception");
  } catch (error) {
    annotatedError(
      "checkAndVerifyRegistrationOtp",
      `Failed to check and verify registration OTP with with CorrelationID [${correlationId}]`,
      error,
      key,
      crmId,
    );
    throw error;
  } finally {
    span.end();
  }
};
