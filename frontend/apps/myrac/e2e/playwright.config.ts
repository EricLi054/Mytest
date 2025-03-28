import { defineConfig, devices } from "playwright/test";

import type { Device } from "@racwa/automation";
import baseConfig from "@racwa/playwright-config";

import { AUTOMATION_ENV } from "./env";

const devicesToTest = (): Device[] => {
  switch (AUTOMATION_ENV) {
    case "local":
      return ["Desktop Chrome"];
    case "dev":
      return ["Desktop Chrome", "iPhone 12"];
    case "sit":
    case "uat":
      return ["Desktop Chrome", "Desktop Firefox", "Desktop Safari", "iPhone 12", "Pixel 5"];
  }
};

const timeout = () => {
  const sixtySeconds = 60_000;

  switch (AUTOMATION_ENV) {
    case "local":
      return sixtySeconds * 2;
    case "dev":
    case "sit":
    case "uat":
      return sixtySeconds;
  }
};

const retries = () => {
  switch (AUTOMATION_ENV) {
    case "local":
    case "dev":
      return 0;
    case "sit":
    case "uat":
      return 2;
  }
};

export default defineConfig({
  ...baseConfig,
  timeout: timeout(),
  retries: retries(),
  fullyParallel: true,
  workers: process.env.CI ? "100%" : 1, // digital-npe-ubuntu-latest runner only has 2 cores
  use: {
    ...baseConfig.use,
    baseURL: {
      local: "http://localhost:3000",
      dev: "https://cdvnetd.ractest.com.au",
      sit: "https://cdvnets.ractest.com.au",
      uat: "https://ractest.com.au",
    }[`${AUTOMATION_ENV}`],
  },
  projects: [
    {
      name: "Global Setup",
      testMatch: "global.setup.ts",
    },
    ...devicesToTest().map((device) => ({
      name: `Roadside Assistance - Update Your Vehicle - ${device}`,
      testDir: "roadside-assistance/update-your-vehicle",
      testMatch: "*.spec.ts",
      dependencies: ["Global Setup"],
      use: { ...devices[`${device}`] },
    })),
  ],
});
