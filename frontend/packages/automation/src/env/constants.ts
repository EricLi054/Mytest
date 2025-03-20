import type { AutomationEnvironment } from "./automationEnv";

type EnvVarRecord = Record<AutomationEnvironment, string>;

export const keyvaultUrl = {
  local: "https://next-rac-vault-dev.vault.azure.net/",
  dev: "https://next-rac-vault-dev.vault.azure.net/",
  sit: "https://next-rac-vault-sit.vault.azure.net/",
  uat: "https://next-rac-vault-uat.vault.azure.net/",
} as const satisfies EnvVarRecord;

export const apimUrl = {
  local: "https://az-api-sit.ractest.com.au",
  dev: "https://az-api-sit.ractest.com.au", // DEV GraphQL layer uses SIT
  sit: "https://az-api-sit.ractest.com.au",
  uat: "https://az-api-uat.ractest.com.au",
} as const satisfies EnvVarRecord;

export const dynamicsUrl = {
  local: "https://racwa-sit.crm6.dynamics.com",
  dev: "https://racwa-sit.crm6.dynamics.com", // DEV GraphQL layer uses SIT
  sit: "https://racwa-sit.crm6.dynamics.com",
  uat: "https://racwa-uat.crm6.dynamics.com",
} as const satisfies EnvVarRecord;

export const msGraphTenantId = {
  local: "RACWAB2CSIT.onmicrosoft.com",
  dev: "RACWAB2CSIT.onmicrosoft.com",
  sit: "RACWAB2CSIT.onmicrosoft.com",
  uat: "RACWAB2CUAT.onmicrosoft.com",
} as const satisfies Record<AutomationEnvironment, string>;

export const msGraphClientId = {
  local: "84c46d4c-bbfb-4ce2-92d8-ea7a02233aac",
  dev: "84c46d4c-bbfb-4ce2-92d8-ea7a02233aac",
  sit: "84c46d4c-bbfb-4ce2-92d8-ea7a02233aac",
  uat: "d871b9a4-8f99-4c07-87dd-c7e17126e224",
} as const satisfies Record<AutomationEnvironment, string>;
