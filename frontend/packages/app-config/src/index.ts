import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import dotenv from "dotenv";

const log = (message: string) => console.log(`@racwa/app-config: ${message}`);

const loadEnvironmentVariables = (environment: string) => {
  dotenv.config({ path: ".env", override: true });
  dotenv.config({ path: `.env.${environment}`, override: true });

  // Replace any variables that depend on another one (e.g. VAR="https://$WEBSITE_VAR.com.au")
  const maxLoops = Object.keys(process.env).length;
  let unresolved = true;
  let count = 0;

  while (unresolved && count < maxLoops) {
    unresolved = false;
    count++;

    for (const [key, value] of Object.entries(process.env)) {
      if (value?.includes("$")) {
        for (const [innerKey, innerValue] of Object.entries(process.env)) {
          if (value.includes(`$${innerKey}`)) {
            const newValue = value.replace(`$${innerKey}`, innerValue ?? "");
            process.env[`${key}`] = newValue;
            unresolved = true;
          }
        }
      }
    }
  }
};

const loadKeyVaultSecrets = async (keyVaultUrl: string | undefined) => {
  if (!keyVaultUrl) {
    throw new Error("Unable to load Application Configuration as KEY_VAULT_URL does not exist");
  }

  const secretClient = new SecretClient(keyVaultUrl, new DefaultAzureCredential());

  const secretsToFetch = [];

  for (const [key, value] of Object.entries(process.env)) {
    if (value === "RETRIEVED_FROM_KEY_VAULT") {
      const secretRequest = secretClient
        .getSecret(key.replaceAll("_", "-"))
        .then((secret) => {
          process.env[`${key}`] = secret.value ?? "";
          log(`Successfully fetched secret for ${key}`);
        })
        .catch(() => {
          log(`Error fetching Key Vault secret for ${key}`);
        });

      secretsToFetch.push(secretRequest);
    }
  }

  await Promise.all(secretsToFetch);
};

export const initApplicationConfiguration = async (environment: string, loadSecrets = true) => {
  log(`Initialising application configuration`);
  loadEnvironmentVariables(environment);
  if (loadSecrets) {
    await loadKeyVaultSecrets(process.env.KEY_VAULT_URL);
  } else {
    log(`Key Vault secrets have not been loaded`);
  }
  log("Application configuration initialised");
};

export default initApplicationConfiguration;
