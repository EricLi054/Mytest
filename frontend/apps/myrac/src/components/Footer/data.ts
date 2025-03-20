import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawFooterSchema } from "./schema";

const query = graphql(`
  query GetFooterData($id: String!, $preview: Boolean) {
    rac_footer(id: $id, preview: $preview) {
      searchBar {
        __typename
        placeholderText
      }
      sitemap: sitemapDataCollection(limit: 3) {
        items {
          parentLink {
            __typename
            longLinkText
            shortLinkText
            linkUrl
          }
          links: linksCollection(limit: 15) {
            items {
              __typename
              longLinkText
              shortLinkText
              linkUrl
            }
          }
        }
      }
      endText {
        json
      }
      logo: logo_data {
        secureUrl
      }
      links: linksCollection(limit: 6) {
        items {
          __typename
          longLinkText
          shortLinkText
          linkUrl
        }
      }
      socialLinks: socialLinksCollection(limit: 6) {
        items {
          __typename
          longText
          link
          icon
          logoHoverColour
          variant
        }
      }
    }
  }
`);

export const getFooterData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawFooterSchema.parse(rawData.data.rac_footer);
    return validatedRawData;
  } catch (error) {
    console.error("getFooterData: Failed to fetch footer data for id:", id, error);
    throw error;
  }
};
