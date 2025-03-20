import type { z } from "zod";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawSlugPageSchema } from "./schema";

const query = graphql(`
  query GetSlugPageData($slug: String!, $preview: Boolean) {
    rac_landingPageCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        __typename
        title
        enableVwo
        breadcrumbs: breadcrumbsCollection(limit: 5) {
          items {
            longLinkText
            linkUrl
          }
        }
        bannerAlerts {
          __typename
          sys {
            id
          }
        }
        navigation {
          __typename
          sys {
            id
          }
        }
        banner {
          __typename
          sys {
            id
          }
        }
        footer {
          __typename
          sys {
            id
          }
        }
        content: contentCollection(limit: 10) {
          __typename
          items {
            ... on rac_DataDrivenForm {
              __typename
              sys {
                id
              }
            }
            ... on rac_Placeholder {
              __typename
              sys {
                id
              }
            }
            ... on rac_Grid {
              __typename
              sys {
                id
              }
            }
          }
        }
      }
    }
    rac_standardErrorPageCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        __typename
        heading
        subHeading
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
            }
          }
        }
      }
    }
  }
`);

const transformContentfulData = (data: z.infer<typeof RawSlugPageSchema>) => {
  const { rac_landingPageCollection, rac_standardErrorPageCollection } = data;

  return {
    landingPage: rac_landingPageCollection?.items[0],
    standardErrorPage: rac_standardErrorPageCollection?.items[0],
  };
};

export const getSlugPageData = async <T>(slug: string, schema: z.ZodSchema<T>): Promise<T> => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getSlugPageData-span");

  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { slug: slug.toLocaleLowerCase(), preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawSlugPageSchema.parse(rawData.data);
    const transformedData = transformContentfulData(validatedRawData);
    const finalValidatedData = schema.parse(transformedData);

    return finalValidatedData;
  } catch (error) {
    console.error("getSlugPageData: failed to fetch data for slug:", slug, error);
    throw error;
  } finally {
    span.end();
  }
};
