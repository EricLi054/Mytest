"use server";

import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { ensureAuthenticatedResponse } from "#utils/session/ensureAuthenticatedResponse";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { AddressValidationSchema } from "./schema";

const query = graphql(`
  query ValidateAddress($moniker: String!) {
    validatePAF(moniker: $moniker) {
      data {
        id
        attributes {
          buildingName
          unit
          allotmentNumber
          buildingNumber
          subBuildingNumber
          streetName
          streetType
          postalDeliveryNumber
          locality
          stateCode
          postcode
          country
        }
      }
    }
  }
`);

export const validateAddress = async (moniker: string) => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("validateAddress-span");

  try {
    await ensureServerSession();
    const token = await getAccessToken();
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: { moniker },
    });

    ensureAuthenticatedResponse(rawData);

    const validatedRawData = AddressValidationSchema.parse(rawData.data);
    return validatedRawData.validatePAF.data;
  } catch (error) {
    console.error("validateAddress: failed to fetch address validation for moniker:", moniker, error);
    throw error;
  } finally {
    span.end();
  }
};
