# @racwa/app-config

This package is a solution to combining all application configuration into a single source, to be used on the Next.JS server.\
It will combine the following:

- Environment Variables
- Key Vault Secrets

## Usage

### Setup Within Application

You want to ensure that the configuration is loaded at the start of your application load.\
The best place for this is your `instrumentation.ts` file, as this is the first point of entry.\
The `CONTAINER_APP_ENV` variable is a special system environment variable set in the infrastructure to let you know which cloud environment we are in (as our `NODE_ENV` will always be set to production in all our environments).\
Following is an example of this implementation.

```typescript
import initApplicationConfiguration from "@racwa/app-config";

export async function register() {
  const environment = process.env.CONTAINER_APP_ENV;
  if (!environment) {
    throw new Error(
      "Missing environment variable 'CONTAINER_APP_ENV' which is required for Application Configuration.",
    );
  }

  await initApplicationConfiguration(environment);
}
```

You also want to ensure that you have set up your Key Vault variables in your `.env*` fil(e)s.\
The package assumes that you have already defined the below environment variables for usage.\
This is because the package will potentially be overwriting existing Key Vault environment variables, so you wouldn't want to be passing this value through (as this value would change between environments).

```json
KEY_VAULT_NAME="next-rac-vault-dev"
KEY_VAULT_URL=https://$KEY_VAULT_NAME.vault.azure.net/
```

When deploying to a cloud environment, you must ensure you have set the `AZURE_CLIENT_ID` environment variable.\
Otherwise, you will get issues fetching the Managed Identity credentials that will be used for Key Vault when deployed.\
To find the value, fetch the Client ID from Azure Portal > Managed Identity > next-rac-identity-{env} > Client ID in the Overview.\
Locally this is not required, as it will use your computer logged in credentials.

```json
AZURE_CLIENT_ID=""
```

### Set Environment Variable(s) and Key Vault Secret(s)

All environment variables will be loaded into the Application Configuration, except if they are 'NEXT_PUBLIC' ones.\
So you can declare a new environment variable like usual.

```json
MY_EXAMPLE_VAR="this-will-be-loaded"
MY_EXAMPLE_VAR_AGAIN="$MY_EXAMPLE_VAR-this-will-also-be-loaded"
NEXT_PUBLIC_MY_EXAMPLE_VAR="this-will-NOT-be-loaded"
```

For a Key Vault secret, you would do the same, except the value you put into your variable is 'RETRIEVED_FROM_KEY_VAULT.\
This tells the Application Configuration that it needs to go fetch this variable from Key Vault.

```json
EXAMPLE_KEY_VAULT_SECRET="RETRIEVED_FROM_KEY_VAULT"
```

When declaring this in Key Vault, you would create it with dashes ("-") instead of underscores ("\_").\
E.g. EXAMPLE-KEY-VAULT-SECRET is what the name of the secret would be in Key Vault for EXAMPLE_KEY_VAULT_SECRET.

### Use Variable in Your Application

Using the following environment file and TypeScript logic as an example, we would be able to use it the same way we would do today.

```json
MY_EXAMPLE_VAR="my-example-var"
EXAMPLE_KEY_VAULT_SECRET="RETRIEVED_FROM_KEY_VAULT"
```

```typescript
import applicationConfig from "@racwa/app-config";

console.log(`MY_EXAMPLE_VAR is: ${process.env.MY_EXAMPLE_VAR}`);
console.log(
  `EXAMPLE_KEY_VAULT_SECRET is: ${process.env.EXAMPLE_KEY_VAULT_SECRET}`,
);
```

This allows minimal confusion, as using both Client and Server environment variables will be the same method.
