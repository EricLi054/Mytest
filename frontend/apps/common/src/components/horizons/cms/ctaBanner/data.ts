import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetCtaBanner($preview: Boolean, $id: String!) {
    horizons_ctaBanner(preview: $preview, id: $id) {
      image {
        image
        image_data {
          context
        }
      }
      contentPosition
      category {
        name
        slug
        colour
      }
      heading
      subtext
      buttonText
      buttonUrl
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getCtaBanner = async (id: string) => {
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
