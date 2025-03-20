"use server";

import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { ADB2CSchema } from "./schema";

const query = graphql(`
  query GetADB2CAccount {
    adb2CAccount {
      id
      crmId
    }
  }
`);

export const getADB2CAccount = async () => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getADB2CAccount-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();
    log("getADB2CAccount", "Starting to fetch ADB2C account", correlationId);

    const token = await getAccessToken();

    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: {},
      headers: {
        CorrelationId: correlationId,
      },
    });

    ensureAuthenticatedResponse(rawData);

    const validatedRawData = ADB2CSchema.parse(rawData.data);
    return validatedRawData.adb2CAccount;
  } catch (error) {
    logError(error, "getADB2CAccount", "Failed to fetch ADB2C account", correlationId);
    throw error;
  } finally {
    span.end();
  }
};
