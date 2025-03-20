"use server";

import { serverEnv } from "#env/server";
import { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetButtonData($id: String!, $preview: Boolean) {
    rac_button(id: $id, preview: $preview) {
      longText
      shortText
      image: image_data {
        secureUrl
      }
      link
      icon
      colour
      border
      variant
    }
  }
`);

export const getButtonData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = ContentfulButtonSchema.parse(rawData.data.rac_button);

    return validatedRawData;
  } catch (error) {
    console.error("getButtonData: failed to fetch button data for id:", id, error);
    throw error;
  }
};
