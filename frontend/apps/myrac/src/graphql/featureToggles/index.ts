"use server";

import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import { graphql } from "gql.tada";
import { getServerSession } from "next-auth";

import { execute } from "@racwa/gql";

import { FeatureToggleSchema } from "./schema";

const query = graphql(`
  query GetFeatureToggles {
    featureToggles {
      key
      value
    }
  }
`);

export const getFeatureToggles = async () => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getFeatureToggles-span");
  const correlationId = crypto.randomUUID();

  try {
    const session = await getServerSession();
    if (!session) return [];

    log("getFeatureToggles", "Starting to fetch feature toggles", correlationId);

    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: {},
      headers: {
        CorrelationId: correlationId,
      },
    });

    ensureAuthenticatedResponse(rawData);

    const validatedRawData = FeatureToggleSchema.parse(rawData.data);
    return validatedRawData.featureToggles;
  } catch (error) {
    logError(error, "getFeatureToggles", "Failed to fetch feature toggles", correlationId);
    throw error;
  } finally {
    span.end();
  }
};
