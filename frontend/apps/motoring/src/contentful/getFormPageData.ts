import type { ResultOf } from "gql.tada";
import type { z } from "zod";
import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import type { CardSchema, FieldItemSchema, NotificationCardSchema } from "./schema";
import { RawFormPageSchema } from "./schema";

const query = graphql(`
  query GetContentfulFormPageData($id: String!, $preview: Boolean) {
    rac_stepperFormPage(id: $id, preview: $preview) {
      heading
      subheading
      fieldsCollection {
        items {
          name
          label
          placeholder
          requiredErrorMessage
          invalidErrorMessage
          tooltipTitle
          tooltipContent {
            json
          }
        }
      }
      notificationCardsCollection {
        items {
          name
          title
          severity
          content {
            json
          }
        }
      }
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

export type FormPageResponse = ResultOf<typeof query>;

const transformContentfulData = (data: z.infer<typeof RawFormPageSchema>) => {
  const { rac_stepperFormPage } = data;

  const fields = rac_stepperFormPage.fieldsCollection.items.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as Record<string, z.infer<typeof FieldItemSchema>>,
  );

  const notifications = rac_stepperFormPage.notificationCardsCollection?.items.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as Record<string, z.infer<typeof NotificationCardSchema>>,
  );

  const cards = rac_stepperFormPage.cardsCollection?.items.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as Record<string, z.infer<typeof CardSchema>>,
  );

  return {
    heading: rac_stepperFormPage.heading,
    subheading: rac_stepperFormPage.subheading,
    fields,
    notifications,
    cards,
  };
};

type GetContentfulFormPageDataParams<T> = {
  id: string;
  schema: z.ZodSchema<T>;
};

export const getContentfulFormPageData = async <T>({ id, schema }: GetContentfulFormPageDataParams<T>): Promise<T> => {
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
    const validatedRawData = RawFormPageSchema.parse(rawData.data);

    // Transform and re-validate with the page-specific schema
    const transformedData = transformContentfulData(validatedRawData);
    const finalValidatedData = schema.parse(transformedData);

    return finalValidatedData;
  } catch {
    // TODO: DED-1244 - Implement logging
    throw new Error(`Failed to fetch Contentful Form Page data with id: ${id}`);
  }
};
