import { createPrefixTransform, defineConfig, loadGraphQLHTTPSubgraph } from "@graphql-mesh/compose-cli";

const containerAppEnv = process.env.CONTAINER_APP_ENV?.toLowerCase() ?? "";
console.log(`Container App Environment: ${containerAppEnv}`);

const contentfulEndpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ALIAS}`;
const contentfulBearerToken = `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`;

const horizonsContentfulEndpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.HORIZONS_CONTENTFUL_SPACE_ID}/environments/${process.env.HORIZONS_CONTENTFUL_ALIAS}`;
const horizonsContentfulBearerToken = `Bearer ${process.env.HORIZONS_CONTENTFUL_ACCESS_TOKEN}`;

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph("racContentful", {
        endpoint: contentfulEndpoint,
        schemaHeaders: { Authorization: contentfulBearerToken },
        operationHeaders: {
          "Content-Type": "application/json",
          Authorization: contentfulBearerToken,
        },
      }),
      transforms: [
        createPrefixTransform({
          value: "rac_",
          includeRootOperations: true,
        }),
      ],
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("horizonsContentful", {
        endpoint: horizonsContentfulEndpoint,
        schemaHeaders: { Authorization: horizonsContentfulBearerToken },
        operationHeaders: {
          "Content-Type": "application/json",
          Authorization: horizonsContentfulBearerToken,
        },
      }),
      transforms: [
        createPrefixTransform({
          value: "horizons_",
          includeRootOperations: true,
        }),
      ],
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("person", {
        endpoint: "http://localhost:5001/graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("motoring", {
        endpoint: "http://localhost:5002/graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("membership", {
        endpoint: "http://localhost:5003/graphql",
      }),
    },
  ],
});
