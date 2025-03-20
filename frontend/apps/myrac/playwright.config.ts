import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env");
console.log("Loading .env file from:", envPath);
dotenv.config({ path: envPath });

const getBaseUrl = () => {
  const env = (process.env.PLAYWRIGHT_ENV?.toUpperCase() || "SIT") as "SIT" | "UAT";
  console.log("Current environment variables:", {
    ENV: env,
    SIT_URL: process.env.PLAYWRIGHT_BASE_SIT_URL,
    UAT_URL: process.env.PLAYWRIGHT_BASE_UAT_URL,
    ENV_PATH: envPath,
  });
  console.log(`Running tests in ${env} environment`);
  const baseUrls = {
    SIT: process.env.PLAYWRIGHT_BASE_SIT_URL,
    UAT: process.env.PLAYWRIGHT_BASE_UAT_URL,
  } as const;

  const baseUrl = baseUrls[env];
  if (!baseUrl) {
    throw new Error(`Base URL for ${env} environment is not defined. Check your .env file or environment variables.`);
  }

  return baseUrl;
};

export default defineConfig({
  timeout: 5 * 60 * 1000,
  testDir: path.join(__dirname, "e2e/tests"),
  testMatch: "*.spec.ts",
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { outputFolder: "../playwright-report" }]],
  use: {
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    baseURL: getBaseUrl(),
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        deviceScaleFactor: undefined,
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ["--start-maximized"],
        },
        isMobile: false,
      },
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },
  ],
});
