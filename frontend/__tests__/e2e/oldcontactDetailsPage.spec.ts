import { expect, test, type Page } from '@playwright/test'
import { login } from './helpers/playwright.auth'
import {
  navigateToContactDetailsPage,
  validateContactDetailsPage
} from './helpers/playwright.navigation'
import {
  authenticateUserToEdit,
  verifyMaskedData
} from './helpers/playwright.mfa'
import { faqPageURL, somethingWentWrongPageURL } from './helpers/playwright.urls'
import {
  getRandomEmail,
  getRandomFirstName,
  getRandomHomePhone,
  getRandomLastName,
  getRandomMiddleName,
  getRandomMobile,
  getRandomTitle,
  getRandomWorkPhone,
  padLandline,
  padMobile
} from './helpers/playwright.helpers'

test('MFA Session testing - tests multiple things otherwise tests become non-deterministic', async({
  page
}: {
  page: Page
}) => {
  await test.step('Login and validate the contact details page', async() => {
    await login(page)
    await navigateToContactDetailsPage(page)
    await validateContactDetailsPage(page)
  })

  await test.step('Verify rendered data is masked', async() => {
    await verifyMaskedData(page)
  })

  await test.step('Attempt to edit the name details and show MFA modal', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'NameEdit' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
    await expect(page.getByText('Let’s verify it’s you')).toBeVisible()
  })

  await test.step('Verify the telephone link for help', async() => {
    await expect(page.getByText('Not your number? Call 13 17 03')).toBeVisible()
    const telLink = await page
      .getByRole('link', { name: '13 17 03' })
      .getAttribute('href')
    expect(telLink).toBe('tel:131703')
  })

  await test.step('Verify can swap between authentication methods', async() => {
    await expect(page.getByText('Get code via phone call')).toBeVisible()
    await page.getByText('Get code via phone call').click()
    await expect(page.getByText('Send code via SMS')).toBeVisible()
  })

  await test.step('Click to receive via phone call, enter incorrect code', async() => {
    await expect(
      page.getByRole('button').getByText('Request a call')
    ).toBeVisible()
    await page.getByRole('button').getByText('Request a call').click({
      timeout: 10000
    })
    await expect(
      page.getByText('Please enter the code to verify it’s you')
    ).toBeVisible()
    await expect(page.getByRole('button').getByText('Verify')).toBeVisible()
    await page.getByRole('button').getByText('Verify').click()
    await expect(
      page.getByText('Please enter a valid verification code.')
    ).toBeVisible()

    const code = ['0', '0', '0', '0', '0', '0']
    await page.getByRole('textbox').nth(0).fill(code[0])
    await page.getByRole('textbox').nth(1).fill(code[1])
    await page.getByRole('textbox').nth(2).fill(code[2])
    await page.getByRole('textbox').nth(3).fill(code[3])
    await page.getByRole('textbox').nth(4).fill(code[4])
    await page.getByRole('textbox').nth(5).fill(code[5])
    await page.getByRole('button').getByText('Verify').click({
      timeout: 10000
    })
    await expect(
      page.getByText(
        "Sorry, that code doesn't match. Please try again or request a new code."
      )
    ).toBeVisible()
  })

  await test.step('Cancel modal and verify rendered data is masked', async() => {
    await page.getByRole('button', { name: 'Close' }).click({
      timeout: 5000
    })
    await verifyMaskedData(page)
  })

  await test.step('Reopen MFA and verify in SMS mode', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'NameEdit' })
      .getByRole('button')
      .click({
        timeout: 9000
      })
    // await page.waitForLoadState('networkidle')

    await expect(page.getByText('Let’s verify it’s you')).toBeVisible({
      timeout: 9000
    })
  })

  await test.step('Authenticate user via SMS', async() => {
    await authenticateUserToEdit(page)
    await expect(
      page.getByRole('button', { name: 'Update name', exact: true })
    ).toBeVisible({ timeout: 9000 })
  })

  // get new random first name
  const firstNameField = page.getByPlaceholder('e.g. John')
  const firstName = getRandomFirstName(await firstNameField.inputValue())

  await test.step('Update first name and cancel the confirmation modal', async() => {
    // update field
    await firstNameField.fill(firstName)

    await page.getByRole('button', { name: 'Update name', exact: true }).click()
    await page.waitForLoadState('domcontentloaded')

    // Cancel the verification modal
    await expect(
      page.getByText('We need to check this is your name')
    ).toBeVisible()
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()

    // Check form is still open and editable
    await expect(
      page.getByRole('button', { name: 'Update name', exact: true })
    ).toBeVisible()
  })

  await test.step('Save again but confirm the change and save successful', async() => {
    await page.getByRole('button', { name: 'Update name', exact: true }).click()
    await page.waitForLoadState('domcontentloaded')

    // Confirm the verification modal
    await expect(
      page.getByText('We need to check this is your name')
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Yes, please update', exact: true })
      .click()

    await expect(page.locator('.MuiDialog-container').first()).toBeVisible({
      timeout: 30000
    })
    await page.getByRole('button', { name: 'Okay', exact: true }).click()
    await authenticateUserToEdit(page) // need to reauth if MFA session ends

    await expect(
      page.locator('form').filter({ hasText: 'NameEdit' })
    ).toContainText(firstName)
  })

  await test.step('Edit name details again, no MFA is required', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'NameEdit' })
      .getByRole('button')
      .click({
        timeout: 9000
      })
    await expect(
      page.getByRole('button', { name: 'Update name', exact: true })
    ).toBeVisible({ timeout: 9000 })
  })

  await test.step('Update details which require no confirmation, check they are saved', async() => {
    // get current values
    const currentTitle = page.locator('button[aria-pressed="true"]')
    const middleNameField = page.getByPlaceholder('e.g. James')
    const lastNameField = page.getByPlaceholder('e.g. Smith')

    // get new values
    const title = getRandomTitle((await currentTitle.textContent()) ?? '')
    const middleName = getRandomMiddleName(await middleNameField.inputValue())
    const lastName = getRandomLastName(await lastNameField.inputValue())

    // update fields
    await page.getByRole('button', { name: title, exact: true }).click()
    await middleNameField.fill(middleName)
    await lastNameField.fill(lastName)

    await page.getByRole('button', { name: 'Update name', exact: true }).click()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('.MuiDialog-container').first()).toBeVisible({
      timeout: 30000
    })
    await page.getByRole('button', { name: 'Okay', exact: true }).click()
    await authenticateUserToEdit(page) // need to reauth if MFA session ends

    await expect(
      page.locator('form').filter({ hasText: 'NameEdit' })
    ).toContainText(title)
    await expect(
      page.locator('form').filter({ hasText: 'NameEdit' })
    ).toContainText(middleName)
    await expect(
      page.locator('form').filter({ hasText: 'NameEdit' })
    ).toContainText(lastName)
  })

  await test.step('Can edit contact details form with no MFA required', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'Contact details' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
    await expect(
      page.getByRole('button', { name: 'Update contacts', exact: true })
    ).toBeVisible()

    // get current values
    const mobileField = page.getByPlaceholder('e.g. 0400 123 456', {
      exact: true
    })
    const homePhoneField = page.getByPlaceholder('e.g. 08 1234 5678', {
      exact: true
    })
    const workPhoneField = page.getByPlaceholder(
      'e.g. 0400 123 456 or 08 1234 5678',
      { exact: true }
    )
    const emailField = page.getByPlaceholder('e.g. example@email.com', {
      exact: true
    })

    // get new values
    const mobile = getRandomMobile(await mobileField.inputValue())
    const homePhone = getRandomHomePhone(await homePhoneField.inputValue())
    const workPhone = getRandomWorkPhone(await workPhoneField.inputValue())
    const email = getRandomEmail(await emailField.inputValue())

    // update fields
    await mobileField.fill(mobile)
    await homePhoneField.fill(homePhone)
    await workPhoneField.fill(workPhone)
    await emailField.fill(email)

    await page
      .getByRole('button', { name: 'Update contacts', exact: true })
      .click()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('.MuiDialog-container').first()).toBeVisible({
      timeout: 30000
    })
    await page.getByRole('button', { name: 'Okay', exact: true }).click()
    await authenticateUserToEdit(page) // need to reauth if MFA session ends

    await expect(
      page.locator('form').filter({ hasText: 'Contact details' })
    ).toContainText(padMobile(mobile))
    await expect(
      page.locator('form').filter({ hasText: 'Contact details' })
    ).toContainText(padLandline(homePhone))
    await expect(
      page.locator('form').filter({ hasText: 'Contact details' })
    ).toContainText(padLandline(workPhone))
    await expect(
      page.locator('form').filter({ hasText: 'Contact details' })
    ).toContainText(email)
  })
})

test('Address lookup testing', async({ page }: { page: Page }) => {
  await test.step('Login and validate the contact details page', async() => {
    await login(
      page,
      process.env.PLAYWRIGHT_BLUE_MEMBER,
      process.env.PLAYWRIGHT_BLUE_PASSWORD
    )
    await navigateToContactDetailsPage(page)
    await validateContactDetailsPage(page)
  })

  await test.step('Attempt to edit the contact details', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'Contact details' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
    await authenticateUserToEdit(page)
    await expect(
      page.getByRole('button', { name: 'Update contacts', exact: true })
    ).toBeVisible()
  })

  await test.step('Update and save address', async() => {
    await page.waitForTimeout(3000) // Wait for the address field to finish verifying the existing address
    await page
      .getByPlaceholder('e.g. 832 Wellington Street, PERTH WA', { exact: true })
      .fill('832 Wellington Street, WEST')
    await page.waitForTimeout(3000) // Wait for the address suggestions to load
    await page
      .getByRole('option', {
        name: '832 Wellington Street, WEST PERTH WA 6005',
        exact: true
      })
      .click()
    await page.waitForTimeout(3000) // Wait for the address field to validate and update

    await page
      .getByRole('button', { name: 'Update contacts', exact: true })
      .click()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('.MuiDialog-container').first()).toBeVisible({
      timeout: 30000
    })
    await page.getByRole('button', { name: 'Okay', exact: true }).click()
    await authenticateUserToEdit(page) // need to reauth if MFA session ends

    await expect(
      page.getByText('832 Wellington St WEST PERTH, WA 6005')
    ).toBeVisible()
  })
})

test('GIVEN I am a logged-in user required to complete MFA, WHEN I navigate to the Contact Details page, AND the MFA dialog is displayed, WHEN I click on the FAQs link within the MFA dialog, THEN I should be redirected to the FAQs page', async({
  page
}: {
  page: Page
}) => {
  await test.step('Login and validate the contact details page', async() => {
    await login(
      page,
      process.env.PLAYWRIGHT_MEMBER_MOBILE_ONLY,
      process.env.PLAYWRIGHT_MEMBER_MOBILE_ONLY_PASSWORD
    )
    await navigateToContactDetailsPage(page)
    await validateContactDetailsPage(page)
  })

  await test.step('Attempt to edit the contact details', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'Contact details' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
    await expect(page.getByText('Let’s verify it’s you')).toBeVisible()
    const faqLink = page.getByText('Visit our FAQs')
    await expect(faqLink).toBeVisible()

    const pagePromise = page.context().waitForEvent('page')
    await faqLink.click()
    const newTab = await pagePromise
    await newTab.waitForURL(faqPageURL, {
      waitUntil: 'domcontentloaded'
    })
  })
})

test('GIVEN I am a logged-in user with only a landline number required to complete MFA, WHEN I navigate to the Contact Details page, AND the MFA dialog is displayed, THEN the links to switch between SMS and phone call should not be visible, AND I should only see the option to receive the MFA code via the landline', async({
  page
}: {
  page: Page
}) => {
  await test.step('Login and validate the contact details page', async() => {
    await login(
      page,
      process.env.PLAYWRIGHT_MEMBER_LANDLINE_ONLY,
      process.env.PLAYWRIGHT_MEMBER_LANDLINE_ONLY_PASSWORD
    )
    await navigateToContactDetailsPage(page)
    await validateContactDetailsPage(page)
  })

  await test.step('Attempt to edit the contact details', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'Contact details' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
    await expect(page.getByText('Let’s verify it’s you')).toBeVisible()
    await expect(
      page.getByRole('button').getByText('Request a call')
    ).toBeVisible()
    await expect(page.getByText('Get code via phone call')).not.toBeVisible() // Landline phones can only receive phone calls
    await expect(page.getByText('Send code via SMS')).not.toBeVisible() // Landline phones cannot receive SMS
  })
})

test('GIVEN I am a logged-in user with no mobile or landline number, WHEN I navigate to the Contact Details page, AND I attempt to edit my contact details, THEN I should be redirected to an error page', async({
  page
}: {
  page: Page
}) => {
  await test.step('Login and validate the contact details page', async() => {
    await login(
      page,
      process.env.PLAYWRIGHT_MEMBER_NO_PHONE,
      process.env.PLAYWRIGHT_MEMBER_NO_PHONE_PASSWORD
    )
    await navigateToContactDetailsPage(page)
    await validateContactDetailsPage(page)
  })

  await test.step('Attempt to edit the contact details', async() => {
    await page
      .locator('form')
      .filter({ hasText: 'Contact details' })
      .getByRole('button')
      .click({
        timeout: 5000
      })
  })

  await test.step('User is redirected to the error page', async() => {
    await page.waitForURL(somethingWentWrongPageURL, {
      waitUntil: 'domcontentloaded'
    })
    await expect(page.getByText('Uh oh!')).toBeVisible()
    await expect(page.getByText('Something went wrong')).toBeVisible()
  })
})
