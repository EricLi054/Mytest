"use server";

import { serverEnv } from "#env/server";
import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetButtonData($id: String!, $preview: Boolean) {
    rac_link(id: $id, preview: $preview) {
      longLinkText
      linkUrl
    }
  }
`);

export const getLinkData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = ContentfulLinkSchema.parse(rawData.data.rac_link);
    return validatedRawData;
  } catch (error) {
    console.error("getLinkData: failed to fetch Link data for id:", id, error);
    throw error;
  }
};
