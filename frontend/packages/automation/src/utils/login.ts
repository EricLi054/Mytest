import type { Page } from "@playwright/test";

import type { AutomationEnvironment } from "../env/automationEnv";
import { automationEnv } from "../env/automationEnv";

export type MyRacAccount = { email: string; password: string };

const loginUrl = {
  local: "https://login-sit.ractest.com.au/**",
  dev: "https://login-sit.ractest.com.au/**",
  sit: "https://login-sit.ractest.com.au/**",
  uat: "https://login-uat.ractest.com.au/**",
} as const satisfies Record<AutomationEnvironment, `https://login-${"sit" | "uat"}.ractest.com.au/**`>;

/**
 * Logs into myRAC using provided myRAC credentials
 * @param account The myRAC account
 * @param page The Playwright page object
 */
export const logIntoMyRac = async ({ account: { email, password }, page }: { account: MyRacAccount; page: Page }) => {
  const { ENVIRONMENT } = automationEnv();

  await page.waitForURL(loginUrl[`${ENVIRONMENT}`]);

  await page.getByPlaceholder("e.g. johnsmith@domain.com").click();
  await page.getByPlaceholder("e.g. johnsmith@domain.com").fill(email);
  await page.getByPlaceholder("Enter your password").click();
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
};
