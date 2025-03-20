import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetHomePageData($preview: Boolean) {
    horizons_pageCollection(limit: 1, preview: $preview, where: { slug: "/" }) {
      items {
        seoMetaTags {
          title
          description
          openGraphTitle
          openGraphDescription
          openGraphImage {
            image
            image_data {
              context
            }
          }
          openGraphSiteName
          openGraphUrl
          allowSearchEngineIndexing
          allowSearchEngineFollowing
        }
        contentCollection {
          items {
            ... on horizons_Entry {
              sys {
                id
              }
              __typename
            }
          }
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getHomePageData = async () => {
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
