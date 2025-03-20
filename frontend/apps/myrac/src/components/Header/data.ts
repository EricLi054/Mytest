import { serverEnv } from "#env/server";
import { logError } from "#utils/logging";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawHeaderSchema } from "./schema";

const query = graphql(`
  query GetHeaderData($id: String!, $preview: Boolean) {
    rac_topNavBar(id: $id, preview: $preview) {
      showBreadcrumbs
      links: linksCollection(limit: 6) {
        items {
          __typename
          longLinkText
          shortLinkText
          linkUrl
          googleAnalyticsDescription
        }
      }
      mobileLinks: mobileLinksCollection(limit: 6) {
        items {
          __typename
          longLinkText
          shortLinkText
          linkUrl
          googleAnalyticsDescription
        }
      }
      searchBar {
        placeholderText
      }
      userMenu {
        menuItems: menuItemsCollection(limit: 8) {
          items {
            __typename
            longLinkText
            shortLinkText
            linkUrl
            googleAnalyticsDescription
          }
        }
      }
    }
  }
`);

export const getHeaderData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawHeaderSchema.parse(rawData.data.rac_topNavBar);
    return validatedRawData;
  } catch (error) {
    logError(error, "getHeaderData", `Failed to fetch Header data with id: ${id}`);
    throw error;
  }
};
