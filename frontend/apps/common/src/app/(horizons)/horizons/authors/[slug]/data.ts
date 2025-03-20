import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetAuthorData($preview: Boolean, $slug: String!) {
    horizons_authorCollection(limit: 1, preview: $preview, where: { slug: $slug }) {
      items {
        name
        bio {
          json
        }
        profilePicture
      }
    }
    horizons_articleCollection(preview: $preview, where: { author: { slug: $slug } }, order: lastUpdated_DESC) {
      items {
        title
        slug
        tileImage {
          image
          image_data {
            context
          }
        }
        category {
          name
          colour
        }
        leadParagraph
        content {
          json
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getAuthorData = async (slug: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      slug,
    },
  });
  return data;
};
