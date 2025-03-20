import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetFilterableContent($preview: Boolean, $id: String!) {
    horizons_filterableContent(preview: $preview, id: $id) {
      sectionColour
      category {
        name
        colour
      }
      heading
      filterBy
      showTagFilters
      showCategoryOnCard
      contentfulMetadata {
        tags {
          id
          name
        }
      }
    }
  }
`);

const { CONTENTFUL_PREVIEW, GRAPHQL_ENDPOINT } = serverEnv();

export const getFilterableContent = async (id: string) => {
  const data = await execute({
    endpoint: GRAPHQL_ENDPOINT,
    sourceSystem: "common",
    query,
    variables: {
      preview: CONTENTFUL_PREVIEW,
      id,
    },
  });
  return data;
};
