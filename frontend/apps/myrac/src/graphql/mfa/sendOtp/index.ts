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

import type { OtpChannelValue, SendOtpResponse } from "@racwa/mfa/types";
import { execute } from "@racwa/gql";

import { SendOtpResponseSchema } from "./schema";

const query = graphql(`
  mutation SendOtp($input: SendOtpInput!) {
    sendOtp(input: $input) {
      hasSendAttemptsRemaining
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

export const sendOtp = async (key: string, channel: OtpChannelValue): Promise<SendOtpResponse> => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("sendOtp-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("sendOtp", "Starting to send OTP", correlationId, crmId);

    const headerStore = await headers();

    const featureToggles = await getFeatureToggles();
    const bypassOtp = featureToggles.find((ft) => ft.key === "BypassOtp")?.value ?? false;

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: { input: { key, channel } },
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

    const validatedResponse = SendOtpResponseSchema.parse(rawResponse.data);

    if (
      validatedResponse.sendOtp.hasSendAttemptsRemaining !== null &&
      validatedResponse.sendOtp.hasSendAttemptsRemaining !== undefined
    ) {
      return {
        data: { hasSendAttemptsRemaining: validatedResponse.sendOtp.hasSendAttemptsRemaining },
      };
    }

    if (validatedResponse.sendOtp.errors && validatedResponse.sendOtp.errors.length === 1) {
      const errorCode = validatedResponse.sendOtp.errors[0]?.__typename;

      if (errorCode === "TooManyRequestsError") {
        return {
          errorCode,
        };
      }
    }

    throw new Error("Unhandled Exception");
  } catch (error) {
    logError(error, "sendOtp", `Failed to send OTP with key: ${key}`, correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
