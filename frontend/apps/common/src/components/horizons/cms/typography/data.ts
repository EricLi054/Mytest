import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetTypography($preview: Boolean, $id: String!) {
    horizons_typography(preview: $preview, id: $id) {
      layoutSize
      heading
      leftContent {
        json
        links {
          entries {
            inline {
              __typename
              sys {
                id
              }
            }
            block {
              __typename
              sys {
                id
              }
            }
          }
        }
      }
      rightContent {
        json
        links {
          entries {
            inline {
              __typename
              sys {
                id
              }
            }
            block {
              __typename
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

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getTypography = async (id: string) => {
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
