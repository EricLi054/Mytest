import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetCallToAction($preview: Boolean, $id: String!) {
    horizons_callToAction(preview: $preview, id: $id) {
      title
      link
      linkText
      image {
        image
        image_data {
          context
        }
      }
      detailedDescription {
        json
      }
      finePrint
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getCallToAction = async (id: string) => {
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
