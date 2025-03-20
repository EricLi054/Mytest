import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetWebsitePage($preview: Boolean, $slug: String) {
    rac_basePageCollection(limit: 1, preview: $preview, where: { slug: $slug }) {
      items {
        slug
        nameOfInstance
        banner {
          __typename
          sys {
            id
          }
        }
        seoMetaTags {
          title
          description
          keywords
          image {
            description
            fileName
            height
            size
            title
            url
            width
          }
        }
        contentCollection {
          items {
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

export const getWebsitePage = async (slug: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: true,
      slug,
    },
  });
  return data;
};
