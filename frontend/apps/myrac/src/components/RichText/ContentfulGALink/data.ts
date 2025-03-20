"use server";

import { serverEnv } from "#env/server";
import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetLink($id: String!, $preview: Boolean) {
    rac_link(id: $id, preview: $preview) {
      __typename
      longLinkText
      linkUrl
      googleAnalyticsDescription
    }
  }
`);

export const getContentfulGALinkData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = ContentfulLinkSchema.parse(rawData.data.rac_link);
    return validatedData;
  } catch (error) {
    console.error("getContentfulGALinkData: Failed to fetch ContentfulGALink data for id:", id, error);
    throw error;
  }
};
