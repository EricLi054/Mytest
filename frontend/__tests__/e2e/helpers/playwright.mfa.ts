import { expect, type Page } from '@playwright/test'
import MailosaurClient from 'mailosaur'

const mailosaur = new MailosaurClient(`${process.env.MAILOSAUR_API_KEY as string}`)

export async function verifyMaskedData(page: Page): Promise<void> {
  await expect(page.getByText(/^04[*\s]{7}\d{3}/).first()).toBeVisible()
}

export async function retrieveLatestMFACodeFromMailosaur(
  receivedAfter: Date
): Promise<string[]> {
  const serverId = process.env.MAILOSAUR_SERVER_ID ?? ''
  const testSms = process.env.MAILOSAUR_SMS_NUMBER ?? ''
  const bufferTimeInMs = 3000

  const sms = await mailosaur.messages.get(
    serverId,
    {
      sentTo: testSms
    },
    {
      receivedAfter: new Date(receivedAfter.getTime() - bufferTimeInMs)
    }
  )

  const smsBody = sms?.text?.body ?? ''
  const code = smsBody?.match(/\d{6}/)?.[0]

  expect(smsBody).toContain('Your RAC - NPE verification code is')
  expect(smsBody).toContain('This code will expire in 10 minutes.')
  expect(code).toBeTruthy()

  // Convert the 6-digit code to an array of individual digits
  const codeArray = code?.split('') ?? []

  return codeArray
}

export async function authenticateUserToEdit(page: Page): Promise<void> {
  try {
    await expect(page.getByText('Let’s verify it’s you')).toBeVisible({
      timeout: 5000
    })
  } catch {
    // If the user is already verified, the dialog will not be displayed
    console.log('User is already verified, skipping MFA process')
    return
  }

  await expect(page.getByRole('button').getByText('Send code')).toBeVisible()
  const timeVerifyButtonClicked = new Date()
  await page.getByRole('button').getByText('Send code').click({
    timeout: 5000
  })
  await expect(
    page.getByText('Please enter the verification code to verify it’s you')
  ).toBeVisible({
    timeout: 10000
  })
  await expect(page.getByRole('button').getByText('Verify')).toBeVisible()

  const code = await retrieveLatestMFACodeFromMailosaur(timeVerifyButtonClicked)
  await page.getByRole('textbox').nth(0).fill(code[0])
  await page.getByRole('textbox').nth(1).fill(code[1])
  await page.getByRole('textbox').nth(2).fill(code[2])
  await page.getByRole('textbox').nth(3).fill(code[3])
  await page.getByRole('textbox').nth(4).fill(code[4])
  await page.getByRole('textbox').nth(5).fill(code[5])
  await page.getByRole('button').getByText('Verify').click({
    timeout: 10000
  })
}
