import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

const query = graphql(`
  query MustacheImage($id: String!, $preview: Boolean) {
    rac_mustacheImage(id: $id, preview: $preview) {
      __typename
      imageIdTemplate
      altTemplate
      borderRadius
    }
  }
`);

const schema = z.object({
  rac_mustacheImage: z.object({
    __typename: z.string(),
    imageIdTemplate: z.string().min(1),
    altTemplate: z.string().optional().nullable(),
    borderRadius: z.number().optional().nullable(),
  }),
});

export const geMustacheImageData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedData = schema.parse(rawData.data);
    return validatedData.rac_mustacheImage;
  } catch (error) {
    console.error("getMustacheImageData: failed to fetch mustache image data for id:", id, error);
    return null;
  }
};
