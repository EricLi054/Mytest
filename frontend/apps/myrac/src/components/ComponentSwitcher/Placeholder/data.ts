import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

import { PlaceholderSchema } from "./schema";

const query = graphql(`
  query GetPlaceholder($id: String!, $preview: Boolean) {
    rac_placeholder(id: $id, preview: $preview) {
      __typename
      placeholderType
      engineeredContentCollection {
        items {
          contentId
          stringContent
          iconContent
          richTextContent {
            json
            links {
              entries {
                inline {
                  __typename
                  sys {
                    id
                  }
                }
              }
            }
          }
          imageContent: cloudinaryContent_data {
            secureUrl
          }
        }
      }
    }
  }
`);

export const schema = z.object({
  rac_placeholder: PlaceholderSchema,
});

export const getPlaceholderData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = schema.parse(rawData.data);
    return validatedData.rac_placeholder;
  } catch (error) {
    console.error("getPlaceholderData: failed to fetch placeholder data for id:", id, error);
    return null;
  }
};
