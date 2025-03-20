import type { ResultOf } from "gql.tada";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { ErrorPageSchema } from "./schema";

const query = graphql(`
  query GetContentfulErrorPageData($id: String!, $preview: Boolean) {
    rac_stepperFormErrorPage(id: $id, preview: $preview) {
      heading
      subheading
      content {
        json
      }
    }
  }
`);

export type ErrorPageResponse = ResultOf<typeof query>;

export const getContentfulErrorPageData = async (id: string) => {
  try {
    const token = await getAccessToken();
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token,
      query,
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    // Validate the raw data
    const validatedRawData = ErrorPageSchema.parse(rawData.data);

    return validatedRawData;
  } catch {
    // TODO: DED-1244 - Implement logging
    throw new Error(`Failed to fetch Contentful Error Page data with id: ${id}`);
  }
};
