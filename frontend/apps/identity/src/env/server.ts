import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  CONTAINER_APP_ENV: z.enum(["local", "dev", "sit", "uat", "prd"]),

  VALID_REDIRECT_HOSTS: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim());
    }

    return val;
  }, z.array(z.string())),

  // GraphQL
  GRAPHQL_ENDPOINT: z.string().url(),

  // Redis
  REDIS_HOST: z.string().min(1),

  // Next Auth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),

  // My RAC
  MY_RAC_HOMEPAGE_URL: z.string().url(),

  // Azure
  AZURE_TENANT_ID: z.string().min(1),
  AZURE_CLIENT_ID: z.string().min(1),
  AZURE_APIM_CLIENT_ID: z.string().min(1),

  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().min(1),

  KEY_VAULT_NAME: z.string().min(1),
  KEY_VAULT_URL: z.string().url(),

  AZURE_MANAGEMENT_APPLICATION_ID: z.string().min(1),

  // ADB2C
  AZURE_AD_B2C_TENANT_ID: z.string().min(1),
  AZURE_AD_B2C_CLIENT_ID: z.string().min(1),
  // AZURE_AD_B2C_CLIENT_SECRET: z.string().min(1),
  AZURE_AD_B2C_CUSTOM_URL: z.string().min(1),
  AZURE_AD_B2C_PRIMARY_USER_FLOW: z.string().min(1),
  AZURE_AD_B2C_EMAIL_UPDATE_FLOW: z.string().min(1),
  AZURE_AD_B2C_PASSWORD_UPDATE_FLOW: z.string().min(1),
  AZURE_AD_B2C_JWKS_URL: z.string().url(),

  // Google
  RECAPTCHA_SITE_SECRET: z.string().min(1),
});

export const serverEnv = () => {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Error parsing server environment variables");
    console.error(result.error);

    throw new Error(result.error.message);
  }

  return result.data;
};
