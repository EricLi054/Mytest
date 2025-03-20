import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetAuthorsData($preview: Boolean) {
    horizons_authorCollection(preview: $preview, order: name_ASC) {
      items {
        name
        slug
        bio {
          json
        }
        profilePicture
        contentfulMetadata {
          tags {
            id
            name
          }
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getAuthorsData = async () => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
    },
  });
  return data;
};
