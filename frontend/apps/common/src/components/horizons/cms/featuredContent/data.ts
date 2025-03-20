import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetFeaturedContent($preview: Boolean, $id: String!) {
    horizons_featuredContent(preview: $preview, id: $id) {
      sectionColour
      category {
        name
        colour
      }
      heading
      cardType
      rendering
      seeMoreButtonText
      seeMoreButtonUrl
      showCategoryOnCard
      showViewAllButton
      viewAllButtonLink
      articlesCollection {
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
            links {
              entries {
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
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getFeaturedContent = async (id: string) => {
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
