import { type Page } from '@playwright/test'
import { landingPageURL } from './playwright.urls'

export async function login(page: Page, username: string = '', password: string = ''): Promise<void> {
  if (username === '' && password === '') {
    username = `${process.env.PLAYWRIGHT_DEFAULT_USERNAME ?? ''}`
    password = `${process.env.PLAYWRIGHT_DEFAULT_PASSWORD ?? ''}`
  }
  // Uses landing page as Sitecore has hard coded redirect here
  await page.goto(landingPageURL, {
    waitUntil: 'domcontentloaded'
  })
  await page.getByPlaceholder('e.g. johnsmith@domain.com').fill(username)
  await page.getByPlaceholder('Enter your password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL(landingPageURL, {
    waitUntil: 'commit'
  })
}
