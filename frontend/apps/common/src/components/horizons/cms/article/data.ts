import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetArticle($preview: Boolean, $id: String!) {
    horizons_article(preview: $preview, id: $id) {
      title
      slug
      category {
        name
        colour
      }
      tileImage {
        image
        image_data {
          context
        }
      }
      content {
        json
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getArticle = async (id: string) => {
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
