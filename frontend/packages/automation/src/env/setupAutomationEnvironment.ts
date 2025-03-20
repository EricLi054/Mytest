/* eslint-disable turbo/no-undeclared-env-vars */

import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

import type { Result } from "@racwa/types";

import type { AutomationEnvironment } from "./automationEnv";
import { secondsTaken } from "../utils";
import { automationEnv } from "./automationEnv";
import { apimUrl, dynamicsUrl, keyvaultUrl, msGraphClientId, msGraphTenantId } from "./constants";

// TODO DED-1842: Add secrets to UAT keyvault
const secretNames = [
  "APIM-SUBSCRIPTION-KEY",
  "DYNAMICS-OAUTH-CLIENT-SECRET",
  "MS-GRAPH-OAUTH-CLIENT-SECRET", // Expires: [SIT 31/08/2025], [UAT 02/09/2025]
] as const;

const log = (message: string) => console.log(`[setupAutomationEnvironment]: ${message}`);

export const setupAutomationEnvironment = async ({
  environment,
}: {
  environment: AutomationEnvironment;
}): Promise<Result> => {
  const start = performance.now();
  log("Fetching automation secrets...");

  try {
    const secretClient = new SecretClient(keyvaultUrl[`${environment}`], new DefaultAzureCredential());

    const secrets = await Promise.all(
      secretNames.map(
        async (secretName): Promise<Result<{ value: { name: string; secret: string }; error: string }>> => {
          const secret = await secretClient.getSecret(`RACWA-AUTOMATION-${secretName}`);

          if (!secret.value) {
            return { success: false, error: `${secretName} value is missing ['${secret.value}']` };
          }

          return { success: true, name: secretName, secret: secret.value };
        },
      ),
    );

    if (secrets.some((secret) => !secret.success)) {
      for (const { error } of secrets.filter((secret) => !secret.success)) {
        log(error);
      }
      return { success: false };
    }

    for (const { name, secret } of secrets.filter((s) => s.success)) {
      process.env[`${name.replace(/-/g, "_")}`] = secret;
    }

    process.env.ENVIRONMENT = environment;
    process.env.APIM_URL = apimUrl[`${environment}`];
    process.env.DYNAMICS_URL = dynamicsUrl[`${environment}`];
    process.env.DYNAMICS_CLIENT_ID = "ddcea47f-dd83-4683-a06d-5240c9917401";
    process.env.MS_GRAPH_TENANT_ID = msGraphTenantId[`${environment}`];
    process.env.MS_GRAPH_CLIENT_ID = msGraphClientId[`${environment}`];

    // This will throw if not valid
    automationEnv();

    log(`Took ${secondsTaken(start)}s`);

    return { success: true };
  } catch (e) {
    log(`Failed to setup automation environment, Error [${e?.toString()}]`);
    return { success: false };
  }
};
