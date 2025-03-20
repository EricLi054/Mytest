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

import { AddressListSchema } from "./schema";

const query = graphql(`
  query GetAddressList($partialAddress: String!) {
    addressList(partialAddress: $partialAddress) {
      data {
        id
        attributes {
          partialAddress
          picklist
        }
      }
    }
  }
`);

export const getAddressList = async (partialAddress: string) => {
  let crmId: string | undefined;
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getAddressList-span");

  const correlationId = crypto.randomUUID();

  try {
    await ensureServerSession();

    const token = await getAccessToken();
    crmId = await getCrmId();

    log("getAddressList", "Starting to fetch address list", correlationId, crmId);

    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: { partialAddress },
      headers: {
        CorrelationId: correlationId,
      },
    });

    ensureAuthenticatedResponse(rawData);

    const validatedRawData = AddressListSchema.parse(rawData.data);
    return validatedRawData.addressList.data;
  } catch (error) {
    logError(error, "getAddressList", "Failed to fetch address list", correlationId, crmId);
    throw error;
  } finally {
    span.end();
  }
};
