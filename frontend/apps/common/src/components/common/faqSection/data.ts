import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetFaqSection($preview: Boolean, $id: String!) {
    rac_faqSection(id: $id, preview: $preview) {
      heading
      questionUrls {
        json
      }
    }
  }
`);

const { GRAPHQL_ENDPOINT } = serverEnv();

export const getFaqSection = async (id: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: true,
      id,
    },
  });
  return data;
};
