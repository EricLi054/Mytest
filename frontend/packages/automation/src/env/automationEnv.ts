import { z } from "zod";

export type AutomationEnvironment = (typeof automationEnvironment)[number];

export const automationEnvironment = ["local", "dev", "sit", "uat"] as const;

const automationEnvSchema = z.object({
  ENVIRONMENT: z.enum(automationEnvironment),
  APIM_URL: z.string().url(),
  APIM_SUBSCRIPTION_KEY: z.string().min(1),
  DYNAMICS_URL: z.string().url(),
  DYNAMICS_CLIENT_ID: z.literal("ddcea47f-dd83-4683-a06d-5240c9917401"),
  DYNAMICS_OAUTH_CLIENT_SECRET: z.string().min(1),
  MS_GRAPH_TENANT_ID: z.string().min(1),
  MS_GRAPH_CLIENT_ID: z.string().min(1),
  MS_GRAPH_OAUTH_CLIENT_SECRET: z.string().min(1),
});

const log = (message: string) => `[automationEnv]: ${message}`;

export const automationEnv = () => {
  const result = automationEnvSchema.safeParse(process.env);

  if (!result.success) {
    log(`Error parsing automation environment variables: [${result.error.toString()}]`);
    throw new Error(result.error.message);
  }

  return result.data;
};
