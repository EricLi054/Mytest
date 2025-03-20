"use server";

import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetWebCardWrapper($preview: Boolean, $id: String!) {
    rac_webCardWrapper(id: $id, preview: $preview) {
      heading
      rendering
      webCardsCollection {
        items {
          sys {
            id
          }
          title
          image
          showRibbon
          ribbonText
          content {
            json
          }
          extraInfoHeader
          extraInfo {
            json
          }
          buttonText
          buttonLink
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export async function getWebCardWrapper(id: string) {
  try {
    const data = await execute({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "common",
      query,
      variables: {
        preview: CONTENTFUL_PREVIEW,
        id,
      },
    });
    return data;
  } catch (error) {
    console.log("Unable to get Web Card Wrapper: ", error);
    return null;
  }
}
