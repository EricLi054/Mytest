import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetGridItemData($id: String!, $preview: Boolean) {
    rac_gridItem(id: $id, preview: $preview) {
      __typename
      title
      width
      justifyContent
      position
      display
      textColour
      flexGrow
      aspectRatio
      textAlign
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
  rac_gridItem: z.object({
    __typename: z.string(),
    title: z.string(),
    width: z.string().nullable(),
    justifyContent: z.string().nullable(),
    position: z.union([z.enum(["static", "relative", "absolute", "fixed", "sticky"]), z.null()]),
    display: z.string().nullable(),
    textColour: z.any(),
    flexGrow: z.string().nullable(),
    aspectRatio: z.string().nullable(),
    textAlign: z.union([z.enum(["left", "right", "center", "justify", "start", "end"]), z.null()]),
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

export const getGridItemData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = schema.parse(rawData.data);
    return validatedData.rac_gridItem;
  } catch (error) {
    console.error("getGridItemData: failed to fetch grid item data for id:", id, error);
    return null;
  }
};
