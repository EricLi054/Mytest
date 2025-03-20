import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetCategorySelect($preview: Boolean, $id: String!) {
    rac_categorySelect(preview: $preview, id: $id) {
      sys {
        id
      }
      categoryName
      contentCollection {
        items {
          ... on rac_FaqSection {
            __typename
            sys {
              id
            }
          }
          ... on rac_ContactMethods {
            __typename
            sys {
              id
            }
          }
          ... on rac_WebCardWrapper {
            __typename
            sys {
              id
            }
          }
        }
      }
    }
  }
`);

const { GRAPHQL_ENDPOINT } = serverEnv();

export const getCategorySelectCollection = async (id: string) => {
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
