import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetArticlesFromCategory($preview: Boolean, $category: String) {
    horizons_articleCollection(preview: $preview, where: { category: { name: $category } }, order: lastUpdated_DESC) {
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
        contentfulMetadata {
          tags {
            id
            name
          }
        }
        sys {
          publishedAt
          firstPublishedAt
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getArticlesFromCategory = async (category: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      category,
    },
  });
  return data;
};
