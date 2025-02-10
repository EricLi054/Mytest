import { expect, type Page, test } from '@playwright/test'
import { login } from './helpers/playwright.auth'
import {
  navigateToUpdateMyDetailsPage,
  validateSomethingWentWrongPage,
  validateUpdateMyDetailsPage
} from './helpers/playwright.navigation'
import { verifyMaskedData } from './helpers/playwright.mfa'
import { loginPageURL, updateMyDetailsPageBaseURL } from './helpers/playwright.urls'

test('GIVEN I am a logged-in user without MFA, WHEN I navigate to the Update My Details page THEN I should see the page is rendered', async ({
  page
}: {
  page: Page
}) => {
  const returnUrl = 'https://rac.com.au/'
  await test.step('Login and validate the update details page with valid URL', async () => {
    const validUrl = updateMyDetailsPageBaseURL.concat(`?return_url=${returnUrl}`)
    await login(page, undefined, undefined, validUrl)
    await validateUpdateMyDetailsPage(page)
  })

  await test.step('Verify rendered data is masked', async () => {
    await verifyMaskedData(page)
  })

  await test.step('Verify the return link is rendered', async () => {
    const returnLink = page.getByRole('link', {
      name: 'Details are correct, continue'
    })
    expect(returnLink).not.toBeNull()
    await expect(returnLink).toHaveAttribute('href', returnUrl)
  })

  await test.step('When return_url is not provided, it should redirect to something-went-wrong page', async () => {
    await navigateToUpdateMyDetailsPage(page, undefined)
    await validateSomethingWentWrongPage(page)
  })
})

test('GIVEN I am not a logged-in user without MFA, WHEN I navigate to the Update My Details page THEN I should be redirected to the login page', async ({
  page
}: {
  page: Page
}) => {
  await test.step('Redirect back to login page', async () => {
    await navigateToUpdateMyDetailsPage(page, undefined)
    await page.waitForURL(loginPageURL, {
      waitUntil: 'domcontentloaded'
    })
  })
})
