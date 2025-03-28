import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import {
  contactDetailsPageURL,
  landingPageURL,
  somethingWentWrongPageURL,
  updateMyDetailsPageBaseURL,
  updateMyDetailsPageURLWildcard,
} from "./urls";

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_WAIT_OPTIONS = { waitUntil: "domcontentloaded" as const };

async function waitForNavigation(page: Page, url: string): Promise<void> {
  await page.waitForURL(url, {
    ...DEFAULT_WAIT_OPTIONS,
    timeout: DEFAULT_TIMEOUT,
  });
}

export async function navigateToLandingPage(page: Page): Promise<void> {
  await page.goto(landingPageURL, DEFAULT_WAIT_OPTIONS);
  await waitForNavigation(page, landingPageURL);
}

export async function validateLandingPage(page: Page): Promise<void> {
  await waitForNavigation(page, landingPageURL);
  await expect(page.locator(".MuiGrid-root").first()).toBeVisible({ timeout: DEFAULT_TIMEOUT });
}

export async function navigateToContactDetailsPage(page: Page): Promise<void> {
  await page.goto(contactDetailsPageURL, DEFAULT_WAIT_OPTIONS);
  await waitForNavigation(page, contactDetailsPageURL);
}

export async function navigateToUpdateMyDetailsPage(page: Page, returnUrl?: string): Promise<void> {
  const url = returnUrl ? `${updateMyDetailsPageBaseURL}?return_url=${returnUrl}` : updateMyDetailsPageBaseURL;

  await page.goto(url, returnUrl ? DEFAULT_WAIT_OPTIONS : { waitUntil: "commit" });
}

export async function validateContactDetailsPage(page: Page): Promise<void> {
  await waitForNavigation(page, contactDetailsPageURL);

  // Verify all headings are visible in sequence
  await expect(page.getByText("Your contact details")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  const headings = ["Name", "Contact details", "Log-in details", "Payment details"];
  for (const heading of headings) {
    await expect(page.locator("h3").getByText(heading)).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  }
}

export async function validateUpdateMyDetailsPage(page: Page): Promise<void> {
  await waitForNavigation(page, updateMyDetailsPageURLWildcard);

  // Verify visible elements
  await expect(page.getByText("Your contact details")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(page.locator("h3").getByText("Contact details")).toBeVisible({ timeout: DEFAULT_TIMEOUT });

  // Verify hidden elements
  const hiddenHeadings = ["Name", "Log-in details", "Payment details"];
  for (const heading of hiddenHeadings) {
    await expect(page.locator("h3").getByText(heading)).not.toBeVisible({ timeout: DEFAULT_TIMEOUT });
  }
}

export async function navigateToNotFoundPage(page: Page): Promise<void> {
  await page.goto(somethingWentWrongPageURL, DEFAULT_WAIT_OPTIONS);
  await waitForNavigation(page, somethingWentWrongPageURL);
}

export async function validateNotFoundPage(page: Page): Promise<void> {
  await waitForNavigation(page, somethingWentWrongPageURL);
  await expect(page.getByText("Uh oh!")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
}

export async function validateSomethingWentWrongPage(page: Page): Promise<void> {
  await waitForNavigation(page, somethingWentWrongPageURL);
  await expect(page.getByText("Uh oh!")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(page.getByText("Something went wrong")).toBeVisible({ timeout: DEFAULT_TIMEOUT });
}
