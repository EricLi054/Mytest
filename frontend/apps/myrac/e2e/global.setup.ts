import { test as setup } from "@playwright/test";

import { setupAutomationEnvironment } from "@racwa/automation";

import { AUTOMATION_ENV } from "./env";

setup("Global Setup", async () => {
  const result = await setupAutomationEnvironment({ environment: AUTOMATION_ENV });

  if (!result.success) {
    throw new Error("Failed to setup automation environment");
  }
});
