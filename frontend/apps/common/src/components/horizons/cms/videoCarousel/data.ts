import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetVideoCarousel($preview: Boolean, $id: String!) {
    horizons_videoCarousel(preview: $preview, id: $id) {
      title
      slug
      sectionColour
      category {
        name
        slug
        colour
      }
      heading
      seeMoreButtonText
      seeMoreButtonUrl
      videosCollection {
        items {
          title
          url
          videoImageThumbnail {
            image
            image_data {
              context
            }
          }
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getVideoCarousel = async (id: string) => {
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
