import type { ResultOf } from "gql.tada";
import type { z } from "zod";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import type { CardSchema } from "./schema";
import { RawConfirmationPageSchema } from "./schema";

const query = graphql(`
  query GetContentfulConfirmationPageData($id: String!, $preview: Boolean) {
    rac_stepperFormConfirmationPage(id: $id, preview: $preview) {
      heading
      subheading
      cardsCollection {
        items {
          name
          title
          content {
            json
          }
        }
      }
    }
  }
`);

export type ConfirmationPageResponse = ResultOf<typeof query>;

const transformContentfulData = (data: z.infer<typeof RawConfirmationPageSchema>) => {
  const { rac_stepperFormConfirmationPage } = data;

  const cards = rac_stepperFormConfirmationPage.cardsCollection.items.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as Record<string, z.infer<typeof CardSchema>>,
  );

  return {
    ...rac_stepperFormConfirmationPage,
    cards,
  };
};

export const getContentfulConfirmationPageData = async <T>(id: string, schema: z.ZodSchema<T>): Promise<T> => {
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
    const validatedRawData = RawConfirmationPageSchema.parse(rawData.data);

    // Transform and re-validate with the page-specific schema
    const transformedData = transformContentfulData(validatedRawData);
    const finalValidatedData = schema.parse(transformedData);

    return finalValidatedData;
  } catch {
    // TODO: DED-1244 - Implement logging
    throw new Error(`Failed to fetch Contentful Confirmation Page data with id: ${id}`);
  }
};
