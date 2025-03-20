import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetBanner($preview: Boolean, $id: String!) {
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
      bannerImage
      links: bannerLinksCollection(limit: 4) {
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

const { GRAPHQL_ENDPOINT } = serverEnv();

export const getBanner = async (id: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: true, // GetContentfulPreviewHeader(),
      id,
    },
  });
  return data;
};
