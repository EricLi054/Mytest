import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetButton($preview: Boolean, $id: String!) {
    horizons_button(preview: $preview, id: $id) {
      variant
      colour
      text
      link
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getButton = async (id: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      id,
    },
  });
  return data;
};
