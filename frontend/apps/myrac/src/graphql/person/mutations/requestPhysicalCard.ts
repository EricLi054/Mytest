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

import { RequestPhysicalCardSchema } from "./schema";

const query = graphql(`
  mutation RequestPhysicalCardMutation {
    requestPhysicalCard {
      physicalCardResponse {
        isSuccess
        value
      }
      errors {
        __typename
      }
    }
  }
`);

export const requestPhysicalCard = async () => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("requestPhysicalCard-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("requestPhysicalCard", "Starting to request physical card", correlationId, crmId);

    const rawResponse = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: {},
      headers: { CorrelationID: correlationId },
    });

    ensureAuthenticatedResponse(rawResponse);

    if (rawResponse.errors?.length) {
      return null;
    }

    const validatedSchema = RequestPhysicalCardSchema.parse(rawResponse.data);

    return validatedSchema;
  } catch (error) {
    logError(error, "requestPhysicalCard", "Failed to request physical card", correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
