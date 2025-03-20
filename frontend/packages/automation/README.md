# @racwa/automation

This package contains shared functionality for end-to-end testing that utilises Playwright.

If you are wanting information regarding how to use Playwright specifically, please see the [Playwright section in the rac-digital wiki](<https://github.com/racwa/rac-digital/wiki/%F0%9F%8E%AD-Playwright-(E2E-Testing)>).

## Setup

`setupAutomationEnvironment` must be called before using this package to ensure the required secrets are loaded into the environment for use.

For Playwright projects, this can as part of the [global setup](https://playwright.dev/docs/test-global-setup-teardown).

```typescript
// global.setup.ts
setup("Global Setup", async () => {
  const result = await setupAutomationEnvironment({
    environment: AUTOMATION_ENV, // "local" | "dev" | "sit" | "uat"
  });

  if (!result.success) {
    throw new Error("Failed to setup automation environment");
  }
});
```

## `/env`

Exposes:

- `setupAutomationEnvironment` to setup the package's `process.env` with required secrets from keyvault.
- `getKeyvaultSecret` for consuming Playwright projects to fetch any secrets they require.

## `/test-data`

Exposes functions that wrap various APIs to access data required for running E2E tests.

- `/adb2cgraph`

  - Utility functions that wrap the `/adb2cgraph/v1` API to link/unlink members from ADB2C accounts.

- `/dynamics`

  - A query function and entity schemas to query for test data from Member Central Dynamics using OData queries.

- `finOps`

  - Utility functions that wrap FinOps APIs such as `productholdings/v2`.

- `msGraph`

  - Utility functions that wrap the Microsoft Graph API.

- `person`
  - Utility functions that wrap the `person/v2` API.

## `/utils`

Various utility functions used by consuming Playwright projects and their tests.
