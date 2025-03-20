import type { VariablesOf } from "gql.tada";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  mutation UpdateRoadsideVehicle($productId: String!, $lineId: String!, $newVehicleDetail: VehicleDetailInput!) {
    updateRoadsideVehicle(productId: $productId, lineId: $lineId, newVehicleDetail: $newVehicleDetail) {
      __typename
    }
  }
`);

export const updateRoadsideVehicle = async (variables: VariablesOf<typeof query>) => {
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
