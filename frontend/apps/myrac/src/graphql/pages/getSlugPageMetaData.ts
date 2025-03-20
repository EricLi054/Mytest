import type { z } from "zod";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawSlugPageMetaDataSchema } from "./schema";

const query = graphql(`
  query GetSlugPageData($slug: String!, $preview: Boolean) {
    rac_landingPageCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        metaData {
          title
          description
        }
      }
    }
    rac_standardErrorPageCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        metaData {
          title
          description
        }
      }
    }
  }
`);

const transformContentfulData = (data: z.infer<typeof RawSlugPageMetaDataSchema>) => {
  const { rac_landingPageCollection, rac_standardErrorPageCollection } = data;

  return {
    landingPage: rac_landingPageCollection?.items[0],
    standardErrorPage: rac_standardErrorPageCollection?.items[0],
  };
};

export const getSlugPageMetaData = async <T>(slug: string, schema: z.ZodSchema<T>): Promise<T> => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getSlugPageMetaData-span");

  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { slug: slug.toLocaleLowerCase(), preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawSlugPageMetaDataSchema.parse(rawData.data);
    const transformedData = transformContentfulData(validatedRawData);
    const finalValidatedData = schema.parse(transformedData);

    return finalValidatedData;
  } catch (error) {
    console.error("getSlugPageMetaData: failed to fetch Landing Page MetaData with slug:", slug, error);
    throw error;
  } finally {
    span.end();
  }
};
