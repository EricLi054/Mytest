"use server";

import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { PolicyDetailsResponseSchema } from "./schema";

const query = graphql(`
  query GetPolicyDetails {
    policyDetails {
      type
      title
      subtitle
      subtitleSecondary
      registrationNumber
      actions {
        label
        link
        type
        analytics {
          description
        }
        subActions {
          label
          link
          subLabel
          analytics {
            description
          }
        }
      }
      alerts {
        message
        severity
      }
      policyItems {
        label
        value
        bundledAmount {
          label
          message
          title
          bundledProducts {
            asset
            productName
          }
        }
        paymentFrequency {
          frequency
          link
          linkText
          message
          preMessage
          title
        }
        paymentMethod {
          accountNumber
          bsb
          cardExpiry
          cardNumber
          link
          linkText
          title
          type
        }
        tooltip {
          message
          title
        }
      }
    }
  }
`);

export const getPolicyDetails = async () => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getPolicyDetails-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();
    const token = await getAccessToken();
    crmId = await getCrmId();

    log("getPolicyDetails", "Starting to fetch policy details", correlationId, crmId);

    const response = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: {},
      headers: { CorrelationID: correlationId },
    });

    ensureAuthenticatedResponse(response);

    const validatedResponse = PolicyDetailsResponseSchema.parse(response);
    if (validatedResponse.errors) {
      validatedResponse.errors.forEach((error) => {
        logError(error, "getPolicyDetails", "Partial product results error occurred", correlationId, crmId);
      });
    }

    return validatedResponse;
  } catch (error) {
    logError(error, "getPolicyDetails", "Failed to fetch policy details", correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
