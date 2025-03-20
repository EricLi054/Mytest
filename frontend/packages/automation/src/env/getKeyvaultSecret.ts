import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

import type { Result } from "@racwa/types";

import { automationEnv } from "./automationEnv";
import { keyvaultUrl } from "./constants";

const message = (message: string) => `[getKeyvaultSecret]: ${message}` as const;

export const getKeyvaultSecret = async (
  secretName: string,
): Promise<Result<{ value: { secret: string }; error: ReturnType<typeof message> }>> => {
  try {
    const secretClient = new SecretClient(keyvaultUrl[`${automationEnv().ENVIRONMENT}`], new DefaultAzureCredential());

    const secret = await secretClient.getSecret(secretName);

    if (!secret.value) {
      return { success: false, error: message(`${secretName} value is missing ['${secret.value}']`) };
    }

    return { success: true, secret: secret.value };
  } catch (e) {
    return { success: false, error: message(`Error: [${e?.toString()}]`) };
  }
};
