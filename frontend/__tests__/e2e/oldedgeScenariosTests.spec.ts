import { expect, test, type Page } from '@playwright/test'
import { navigateToLandingPage } from './helpers/playwright.navigation'
import { loginPageURL, somethingWentWrongPageURL } from './helpers/playwright.urls'
import { login } from './helpers/playwright.auth'

const visibilityTimeout = 15000

test('GIVEN I am an unauthenticated user, WHEN I navigate to the myRAC page, THEN I should be redirected to the login page', async({ page }: { page: Page }) => {
  await test.step('Attempt to access the landing page', async() => {
    await navigateToLandingPage(page)
  })

  await test.step('Wait for login page elements to become visible', async() => {
    await page.waitForURL(loginPageURL, {
      waitUntil: 'domcontentloaded'
    })
    await expect(page.getByPlaceholder('e.g. johnsmith@domain.com')).toBeVisible({
      timeout: visibilityTimeout
    })
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible({
      timeout: visibilityTimeout
    })
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible({
      timeout: visibilityTimeout
    })
  })
})

test('GIVEN I am logged-in using an account with a non-existent CRM ID, WHEN I navigate to the myRAC page, THEN I should be redirected to the something went wrong page', async({ page }: { page: Page }) => {
  await login(page, process.env.PLAYWRIGHT_CRMID_NOTFOUND, process.env.PLAYWRIGHT_CRMID_NOTFOUND_PASSWORD)
  await page.waitForURL(somethingWentWrongPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await expect(page.getByText('Uh oh!')).toBeVisible()
  await expect(page.getByText('Something went wrong')).toBeVisible()
})
