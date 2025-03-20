import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetContactMethods($preview: Boolean, $id: String!) {
    rac_contactMethods(id: $id, preview: $preview) {
      heading
      rendering
      contactNumbersCollection {
        items {
          businessAreaCovered
          phoneNumber
          openingHours
          additionalOpeningHours
        }
      }
    }
  }
`);

const { GRAPHQL_ENDPOINT } = serverEnv();

export const getContactMethods = async (id: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: true,
      id,
    },
  });
  return data;
};
