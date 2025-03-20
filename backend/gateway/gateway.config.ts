import type { AzureMonitorExporterOptions } from "@azure/monitor-opentelemetry-exporter";
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";
import {
  createAzureMonitorExporter,
  createRemoteJwksSigningKeyProvider,
  createStdoutExporter,
  defineConfig,
  extractFromHeader,
  LogLevel,
} from "@graphql-hive/gateway";
import { Resource } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const nonProdEnvironments = ["local", "dev", "sit", "uat"];

const serviceName = "gateway";

const azureMonitorExporterOptions: AzureMonitorExporterOptions = {
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
};

const azureMonitorTraceExporter = new AzureMonitorTraceExporter(azureMonitorExporterOptions);

const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: serviceName,
  }),
  spanProcessors: [new BatchSpanProcessor(azureMonitorTraceExporter)],
});

const containerAppEnv = process.env.CONTAINER_APP_ENV?.toLowerCase() ?? "";
console.log(`Container app environment: ${containerAppEnv}`);

const logLevel = process.env.ENABLE_SUPERGRAPH_DEBUG_LOGGING === "true" ? LogLevel.debug : LogLevel.info;
console.log(`Gateway logging level: ${logLevel}`);

export const gatewayConfig = defineConfig({
  logging: logLevel,
  landingPage: false,
  supergraph: "./supergraph.graphql",
  propagateHeaders: {
    fromClientToSubgraphs({ request, subgraphName }) {
      const headers: Record<string, string> = {};

      if (subgraphName !== "racContentful" && subgraphName !== "horizonsContentful") {
        headers["Authorization"] = request.headers.get("Authorization") ?? "";
        headers["CorrelationId"] = request.headers.get("CorrelationId") ?? "";
        headers["SourceSystem"] = request.headers.get("SourceSystem") ?? "";
        headers["User-Agent"] = request.headers.get("User-Agent") ?? "";
      }

      // Set MFA NPE headers for person subgraph in non-production environments
      if (subgraphName?.toLowerCase() === "person" && nonProdEnvironments.includes(containerAppEnv)) {
        headers["Feature_BypassOtp"] = request.headers.get("Feature_BypassOtp") ?? "true";
        headers["Feature_OverrideToNumber"] = request.headers.get("Feature_OverrideToNumber") ?? "";
      }

      return headers;
    },
  },
  jwt: {
    tokenLookupLocations: [extractFromHeader({ name: "Authorization", prefix: "Bearer" })],
    singingKeyProviders: [
      createRemoteJwksSigningKeyProvider({
        jwksUri: process.env.AZURE_AD_B2C_JWKS_URL || "",
      }),
      createRemoteJwksSigningKeyProvider({
        jwksUri: process.env.AZURE_AD_JWKS_URL || "",
      }),
    ],
    forward: {
      payload: false,
      token: false,
    },
    reject: {
      missingToken: false,
      invalidToken: true,
    },
  },
  openTelemetry: {
    serviceName: serviceName,
    exporters: [createStdoutExporter(true), createAzureMonitorExporter(azureMonitorExporterOptions, true)],
    tracer: tracerProvider.getTracer(serviceName),
    inheritContext: true,
    propagateContext: true,
    spans: {
      http: true,
      graphqlParse: true,
      graphqlValidate: true,
      graphqlExecute: true,
      subgraphExecute: true,
      upstreamFetch: true,
    },
  },
});
