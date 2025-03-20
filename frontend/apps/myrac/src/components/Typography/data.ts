import { serverEnv } from "#env/server";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetTypography($id: String!, $preview: Boolean) {
    rac_typography(id: $id, preview: $preview) {
      title
      text {
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
    }
  }
`);

const typographySchema = z.object({
  title: z.string(),
  text: RichTextSchema,
});

const schema = z.object({
  rac_typography: typographySchema,
});

export const getTypographyData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = schema.parse(rawData.data);
    return validatedData.rac_typography;
  } catch (error) {
    console.error("getTypographyData: Failed to fetch typography data for id:", id, error);
    return null;
  }
};
