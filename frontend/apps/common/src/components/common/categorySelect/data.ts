import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetCategorySelectCollection($preview: Boolean, $slug: String) {
    rac_basePageCollection(preview: $preview, where: { slug: $slug }) {
      items {
        slug
        contentCollection {
          items {
            ... on rac_CategorySelect {
              categoryName
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
`);

const { GRAPHQL_ENDPOINT } = serverEnv();

export const getDropDownCollection = async (slug: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      slug: slug,
      preview: true,
    },
  });
  return data;
};
