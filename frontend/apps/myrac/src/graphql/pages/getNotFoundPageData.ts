import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { RawErrorPageSchema } from "./schema";

// TODO: Refactor this as its the only page that uses this anymore
const query = graphql(`
  query GetErrorPageData($type: String!, $preview: Boolean) {
    rac_errorPageCollection(limit: 1, where: { type: $type }, preview: $preview) {
      items {
        title
        navigation {
          sys {
            id
          }
        }
        footer {
          sys {
            id
          }
        }
      }
    }
  }
`);

export const getNotFoundPageData = async () => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getNotFoundPageData-span");

  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { type: "not-found", preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = RawErrorPageSchema.parse(rawData.data);

    return validatedRawData.rac_errorPageCollection.items[0];
  } catch (error) {
    console.error("getNotFoundPageData: failed to fetch Not Found error page", error);
    throw error;
  } finally {
    span.end();
  }
};
