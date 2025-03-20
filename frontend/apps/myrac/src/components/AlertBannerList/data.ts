import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { BannerAlertCollectionSchema } from "./schema";

const query = graphql(`
  query GetBannerAlertList($id: String!, $preview: Boolean) {
    rac_bannerAlertList(id: $id, preview: $preview) {
      bannerAlertsCollection {
        items {
          title
          icon
          bodyText {
            json
          }
        }
      }
    }
  }
`);

export const getBannerAlertsData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    return BannerAlertCollectionSchema.parse(rawData.data).rac_bannerAlertList.bannerAlertsCollection;
  } catch (error) {
    console.error("getBannerAlertsData: failed to fetch banner alerts for id:", id, error);
    return null;
  }
};
