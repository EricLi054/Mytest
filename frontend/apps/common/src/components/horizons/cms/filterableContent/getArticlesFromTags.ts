import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetArticlesFromTags($preview: Boolean, $tagIds: [String]) {
    horizons_articleCollection(
      preview: $preview
      where: { contentfulMetadata: { tags: { id_contains_some: $tagIds } } }
      order: lastUpdated_DESC
    ) {
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

export const getArticlesFromTags = async (tagIds: string[]) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      tagIds,
    },
  });
  return data;
};
