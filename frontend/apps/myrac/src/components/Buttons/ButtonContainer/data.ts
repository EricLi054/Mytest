import { serverEnv } from "#env/server";
import { logError } from "#utils/logging";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { ContentfulButtonContainerSchema } from "./schema";

const query = graphql(`
  query GetButtonContainerData($id: String!, $preview: Boolean) {
    rac_buttonContainer(id: $id, preview: $preview) {
      stackTogether
      itemsPerRow
      largeWidth
      columnBreakpoint
      gap
      buttons: contentItemsCollection(limit: 10) {
        items {
          ... on rac_Button {
            sys {
              id
            }
          }
        }
      }
    }
  }
`);

export const getButtonContainerData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = ContentfulButtonContainerSchema.parse(rawData.data.rac_buttonContainer);

    return validatedRawData;
  } catch (error) {
    logError(error, "getButtonContainerData", `Failed to fetch button container data with id: ${id}`);
    throw error;
  }
};
