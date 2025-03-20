"use server";

import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { MustacheTemplateSchema } from "./schema";

const query = graphql(`
  query GetMustacheData($id: String!, $preview: Boolean) {
    rac_mustacheTemplates(id: $id, preview: $preview) {
      template
      textColour {
        hex
      }
    }
  }
`);

export const getMustacheData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = MustacheTemplateSchema.parse(rawData.data.rac_mustacheTemplates);

    return validatedRawData;
  } catch (error) {
    console.error("getMustacheData: Failed to fetch Mustache data for id:", id, error);
    throw error;
  }
};
