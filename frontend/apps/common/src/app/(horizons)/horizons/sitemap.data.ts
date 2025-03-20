import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetSitemapData($preview: Boolean) {
    horizons_pageCollection(preview: $preview, limit: 100, order: sys_publishedAt_DESC) {
      items {
        slug
        sys {
          publishedAt
        }
      }
    }
    horizons_articleCollection(preview: $preview, limit: 1000, order: published_DESC) {
      items {
        slug
        published
        sys {
          publishedAt
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getSitemapData = async () => {
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
