import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetGridData($id: String!, $preview: Boolean) {
    rac_grid(id: $id, preview: $preview) {
      __typename
      title
      direction
      width
      justifyContent
      alignItems
      textAlign
      gap
      padding
      background
      wrap
      contentItemsCollection(limit: 10) {
        items {
          ... on rac_Entry {
            __typename
            sys {
              id
            }
          }
        }
      }
    }
  }
`);

const schema = z.object({
  rac_grid: z.object({
    __typename: z.string(),
    title: z.string(),
    direction: z.union([z.enum(["row", "column", "row-reverse", "column-reverse"]), z.null()]),
    width: z.string().nullable(),
    justifyContent: z.string().nullable(),
    alignItems: z.string().nullable(),
    textAlign: z.enum(["left", "right", "center", "justify"]).nullable(),
    gap: z.string().nullable(),
    padding: z.string().nullable(),
    background: z.string().nullable(),
    wrap: z.enum(["wrap", "nowrap", "wrap-reverse"]).nullable(),
    contentItemsCollection: z.object({
      items: z.array(
        z.object({
          __typename: z.string(),
          sys: z.object({
            id: z.string(),
          }),
        }),
      ),
    }),
  }),
});

export const getGridData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = schema.parse(rawData.data);
    return validatedData.rac_grid;
  } catch (error) {
    console.error("getGridData: failed to fetch grid data for id:", id, error);
    return null;
  }
};
