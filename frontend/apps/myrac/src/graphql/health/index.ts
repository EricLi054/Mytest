import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetHealthData {
    rac_landingPageCollection(limit: 1) {
      items {
        __typename
      }
    }
    serviceIsAlive {
      personService
    }
  }
`);

export const getHealthData = async () => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("getHealthData-span");

  try {
    const response = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: {},
    });

    if (response.errors) {
      console.error("getHealthData: failed to fetch Health Data", response.errors);
      return false;
    }

    if (!response.data.serviceIsAlive.personService) {
      console.error("getHealthData: Person service is not alive");
      return false;
    }

    if (
      response.data.rac_landingPageCollection === null ||
      response.data.rac_landingPageCollection.items.length === 0
    ) {
      console.error("getHealthData: Contentful is not alive");
      return false;
    }

    return true;
  } catch (error) {
    console.error("getHealthData: failed to fetch Health Data", error);
    return false;
  } finally {
    span.end();
  }
};
