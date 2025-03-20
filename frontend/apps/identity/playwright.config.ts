import dotenv from "dotenv";
import { defineConfig } from "playwright/test";

import baseConfig from "@racwa/playwright-config";

dotenv.config({ path: ".env" });

export default defineConfig({
  ...baseConfig,
  testDir: "./src/tests/e2e",
  webServer: {
    command: "pnpm dev",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
