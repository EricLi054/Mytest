import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetLinkList($preview: Boolean, $id: String!) {
    horizons_linkList(preview: $preview, id: $id) {
      sectionColour
      category {
        name
        colour
      }
      heading
      pagesCollection {
        items {
          title
          slug
          seoMetaTags {
            openGraphImage {
              image
              image_data {
                context
              }
            }
          }
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getLinkList = async (id: string) => {
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
