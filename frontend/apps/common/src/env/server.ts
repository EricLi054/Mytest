import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Server
  CONTAINER_APP_ENV: z.enum(["local", "dev", "sit", "uat", "prd"]),
  CONTENTFUL_PREVIEW: z.enum(["true", "false"]).transform((value) => value === "true"),
  GRAPHQL_ENDPOINT: z.string().url(),

  KEY_VAULT_NAME: z.string().min(1),
  KEY_VAULT_URL: z.string().url(),

  GTM_ID: z.string().min(1),
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
