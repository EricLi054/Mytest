import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetPageData($preview: Boolean, $slug: String) {
    horizons_articleCollection(limit: 1, preview: $preview, where: { slug: $slug }) {
      items {
        title
        slug
        seoMetaTags {
          title
          description
          openGraphTitle
          openGraphDescription
          openGraphImage {
            image
            image_data {
              context
            }
          }
          openGraphSiteName
          openGraphUrl
          allowSearchEngineIndexing
          allowSearchEngineFollowing
        }
        redirectUrl
        bannerImage {
          image
          image_data {
            context
          }
        }
        tileImage {
          image
          image_data {
            context
          }
        }
        category {
          name
          slug
          colour
        }
        lastUpdated
        published
        leadParagraph
        renderTags
        showArticleSummary
        content {
          json
          links {
            entries {
              inline {
                __typename
                sys {
                  id
                }
              }
              block {
                __typename
                sys {
                  id
                }
              }
            }
          }
        }
        author {
          name
          slug
          profilePicture
        }
        relatedArticlesCollection {
          items {
            __typename
            sys {
              id
            }
          }
        }
        contentfulMetadata {
          tags {
            id
            name
          }
        }
        sys {
          publishedAt
          firstPublishedAt
        }
      }
    }
    horizons_pageCollection(limit: 1, preview: $preview, where: { slug: $slug }) {
      items {
        title
        slug
        seoMetaTags {
          title
          description
          openGraphTitle
          openGraphDescription
          openGraphImage {
            image
            image_data {
              context
            }
          }
          openGraphSiteName
          openGraphUrl
          allowSearchEngineIndexing
          allowSearchEngineFollowing
        }
        contentCollection {
          items {
            ... on horizons_Entry {
              sys {
                id
              }
              __typename
            }
          }
        }
        contentfulMetadata {
          tags {
            id
            name
          }
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getPageData = async (slug: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      slug,
    },
  });
  return data;
};
