"use server";

import { headers } from "next/headers";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { annotatedError, annotatedLog } from "#utils/logging";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  mutation CheckRegistrationOtp($key: String!, $crmId: String!) {
    checkRegistrationOtp(key: $key, crmId: $crmId) {
      isAuthenticated
    }
  }
`);

export const checkRegistrationOtp = async (key: string, crmId: string) => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("check-registration-otp-gql-span");
  const correlationId = crypto.randomUUID();

  try {
    // await ensureServerSession(); // TODO - DED-2331 - myRAC does this, but it is always returning null session here and in the root layout
    const token = await getAccessToken();
    const headerStore = await headers();

    annotatedLog(
      "checkRegistrationOtp",
      `Starting to check registration OTP with CorrelationID [${correlationId}]`,
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
        // TODO - DED-1296 - Does the UserAgent header need to be set here? RACI OTP Service CheckOtpRequestHandler has detectUnauthorisedAccess set to false
        // TODO - DED-1296 - What happens if User-Agent is undefined? RACI MFA OTP Service will error on verify. Should Person subgraph MFA Service throw exception?
        "User-Agent": headerStore.get("User-Agent") ?? "",
      },
    });

    return rawResponse.data.checkRegistrationOtp ? rawResponse.data.checkRegistrationOtp.isAuthenticated : false;
  } catch (error) {
    annotatedError(
      "checkRegistrationOtp",
      `Failed to check registration OTP with with CorrelationID [${correlationId}]`,
      error,
      key,
      crmId,
    );
    throw error;
  } finally {
    span.end();
  }
};
