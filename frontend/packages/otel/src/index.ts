import { useAzureMonitor } from "@azure/monitor-opentelemetry";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

export const init = (serviceName: string) => {
  registerInstrumentations({
    instrumentations: [getNodeAutoInstrumentations()],
  });

  useAzureMonitor({
    resource: new Resource({ [ATTR_SERVICE_NAME]: serviceName }),
  });
};
