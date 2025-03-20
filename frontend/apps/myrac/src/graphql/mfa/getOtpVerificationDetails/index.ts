"use server";

import type { ResultOf } from "gql.tada";
import { headers } from "next/headers";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  mutation OtpVerificationDetails($key: String!) {
    otpVerificationDetails(key: $key) {
      isAuthenticated
      isMobile
      phoneNumberSuffix
    }
  }
`);

export type OtpVerificationDetailsResponse = ResultOf<typeof query>;

export const getOtpVerificationDetails = async (key: string) => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getOtpVerificationDetails-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("getOtpVerificationDetails", "Starting to get OTP Verification Details", correlationId, crmId);

    const headerStore = await headers();
    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: { key },
      headers: { "User-Agent": headerStore.get("User-Agent") ?? "", CorrelationID: correlationId },
    });

    if (!rawResponse.data.otpVerificationDetails) {
      if (rawResponse.errors?.[0]) {
        throw new Error(rawResponse.errors[0].message);
      }
      throw new Error("Unhandled exception");
    }

    return rawResponse.data.otpVerificationDetails;
  } catch (error) {
    logError(
      error,
      "getOtpVerificationDetails",
      `Failed to get OTP Verification Details with key: ${key}`,
      correlationId,
      crmId,
    );
    throw error;
  } finally {
    span.end();
  }
};
