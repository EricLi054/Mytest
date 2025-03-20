import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawBannerSchema } from "./schema";

const query = graphql(`
  query GetBannerData($id: String!, $preview: Boolean) {
    rac_banner(id: $id, preview: $preview) {
      heading {
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
      bannerImage: bannerImage_data {
        secureUrl
      }
      bannerLinksCollection(limit: 4) {
        items {
          __typename
          longText
          shortText
          icon
          link
        }
      }
    }
  }
`);

export const getBannerData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawBannerSchema.parse(rawData.data.rac_banner);

    return validatedRawData;
  } catch (error) {
    console.error("getBannerData: failed to fetch banner alerts for id:", id, error);
    throw error;
  }
};
