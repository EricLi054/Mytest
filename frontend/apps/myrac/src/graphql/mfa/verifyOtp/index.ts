"use server";

import { headers } from "next/headers";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { getFeatureToggles } from "#graphql/featureToggles";
import { log, logError } from "#utils/logging";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";

import type { CheckAndVerifyOtpResponse } from "@racwa/mfa/types";
import { execute } from "@racwa/gql";

import { VerifyOtpResponseSchema } from "./schema";

const query = graphql(`
  mutation VerifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      isVerified
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

export const verifyOtp = async (key: string, code: string): Promise<CheckAndVerifyOtpResponse> => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("verifyOtp-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("verifyOtp", "Starting to verify OTP", correlationId, crmId);

    const headerStore = await headers();

    const featureToggles = await getFeatureToggles();
    const bypassOtp = featureToggles.find((ft) => ft.key === "BypassOtp")?.value ?? false;

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: { input: { key, code } },
      headers: {
        "User-Agent": headerStore.get("User-Agent") ?? "",
        Feature_BypassOtp: bypassOtp.toString(),
        Feature_OverrideToNumber: serverEnv().MFA_OVERRIDE_TO_NUMBER ?? "",
        CorrelationId: correlationId,
      },
    });

    if (rawResponse.errors) {
      throw new Error("Unhandled Exception");
    }

    const validatedResponse = VerifyOtpResponseSchema.parse(rawResponse.data);

    if (validatedResponse.verifyOtp.isVerified !== null && validatedResponse.verifyOtp.isVerified !== undefined) {
      return {
        data: { isVerified: validatedResponse.verifyOtp.isVerified },
      };
    }

    if (validatedResponse.verifyOtp.errors && validatedResponse.verifyOtp.errors.length === 1) {
      const errorCode = validatedResponse.verifyOtp.errors[0]?.__typename;

      if (errorCode === "TooManyRequestsError" || errorCode === "NotFoundError") {
        return {
          errorCode,
        };
      }
    }

    throw new Error("Unhandled Exception");
  } catch (error) {
    logError(error, "verifyOtp", `Failed to verify OTP with key: ${key}`, correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
