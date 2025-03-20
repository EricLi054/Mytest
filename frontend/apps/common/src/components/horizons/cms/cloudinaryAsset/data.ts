import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetCloudinaryAsset($preview: Boolean, $id: String!) {
    horizons_cloudinaryAsset(preview: $preview, id: $id) {
      title
      image
      image_data {
        context
      }
      showCaption
      link
      openLinkInNewTab
      fillContainerWidth
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getCloudinaryAsset = async (id: string) => {
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
