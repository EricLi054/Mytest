import { expect, type Page } from '@playwright/test'
import {
  contactDetailsPageURL,
  landingPageURL,
  somethingWentWrongPageURL,
  updateMyDetailsPageBaseURL,
  updateMyDetailsPageURLWildcard
} from './playwright.urls'

export async function navigateToLandingPage(page: Page): Promise<void> {
  await page.goto(landingPageURL, {
    waitUntil: 'domcontentloaded'
  })
}

export async function validateLandingPage(page: Page): Promise<void> {
  await page.waitForURL(landingPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.locator('.MuiGrid-root').first()).toBeVisible()
}

export async function navigateToContactDetailsPage(page: Page): Promise<void> {
  await page.goto(contactDetailsPageURL, {
    waitUntil: 'domcontentloaded'
  })
}

export async function navigateToUpdateMyDetailsPage(
  page: Page,
  returnUrl: string | undefined
): Promise<void> {
  const url = returnUrl
    ? updateMyDetailsPageBaseURL.concat(`?return_url=${returnUrl}`)
    : updateMyDetailsPageBaseURL

  if (returnUrl) {
    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    })
  } else {
    await page.goto(url, {
      waitUntil: 'commit'
    })
  }
}

export async function validateContactDetailsPage(page: Page): Promise<void> {
  await page.waitForURL(contactDetailsPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.getByText('Your contact details')).toBeVisible()
  await expect(page.locator('h3').getByText('Name')).toBeVisible()
  await expect(page.locator('h3').getByText('Contact details')).toBeVisible()
  await expect(page.locator('h3').getByText('Log-in details')).toBeVisible()
  await expect(page.locator('h3').getByText('Payment details')).toBeVisible()
}

export async function validateUpdateMyDetailsPage(page: Page): Promise<void> {
  await page.waitForURL(updateMyDetailsPageURLWildcard, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.getByText('Your contact details')).toBeVisible()
  await expect(page.locator('h3').getByText('Name')).not.toBeVisible()
  await expect(page.locator('h3').getByText('Contact details')).toBeVisible()
  await expect(page.locator('h3').getByText('Log-in details')).not.toBeVisible()
  await expect(page.locator('h3').getByText('Payment details')).not.toBeVisible()
}

export async function navigateToNotFoundPage(page: Page): Promise<void> {
  await page.goto(somethingWentWrongPageURL, {
    waitUntil: 'domcontentloaded'
  })
}

export async function validateNotFoundPage(page: Page): Promise<void> {
  await page.waitForURL(somethingWentWrongPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.getByText('Uh oh!')).toBeVisible()
}

export async function validateSomethingWentWrongPage(page: Page): Promise<void> {
  await page.waitForURL(somethingWentWrongPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.getByText('Uh oh!')).toBeVisible()
  await expect(page.getByText('Something went wrong')).toBeVisible()
}
