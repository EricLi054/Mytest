"use server";

import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const { GRAPHQL_ENDPOINT } = serverEnv();

const updateAdAccountCrmIdQuery = graphql(`
  mutation updateAdAccountCrmId($adb2cAccountId: String!, $crmId: String!) {
    updateAdAccountCrmId(adb2cAccountId: $adb2cAccountId, crmId: $crmId) {
      isSuccessful
    }
  }
`);

export type UpdateADB2CAccountCrmIdParams = {
  crmId: string;
  adb2cAccountId: string;
};

export const UpdateADB2CAccountCrmId = async (
  { crmId, adb2cAccountId }: UpdateADB2CAccountCrmIdParams,
  token: string,
) => {
  const variables = {
    adb2cAccountId,
    crmId,
  };
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    token,
    query: updateAdAccountCrmIdQuery,
    sourceSystem: "identity",
    variables,
  });

  return data;
};
