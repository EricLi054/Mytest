import type { VariablesOf } from "gql.tada";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetVehicleByRego($vehicleByRego: VehicleByRegoQueryInput!) {
    vehicleByRego(query: $vehicleByRego) {
      year
      make
      model
      variant
      series
      body
      height
      length
      width
      kerbWeight
      transmission
      fuel
      cylinder
      cc
      co2Emission
      registrationNumber
      vin
      nvic
    }
  }
`);

export const getVehicleDetailsByRego = async (variables: VariablesOf<typeof query>) => {
  const token = await getAccessToken();
  const data = await execute({
    endpoint: serverEnv().GRAPHQL_ENDPOINT,
    sourceSystem: "motoring",
    token,
    query,
    variables,
  });
  return data;
};
