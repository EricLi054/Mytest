import { expect, Page } from '@playwright/test';
import MailosaurClient from 'mailosaur';

const mailosaur = new MailosaurClient(`${process.env.MAILOSAUR_API_KEY as string}`);

export class MFAOTP {
  static async verifyMaskedData(page: Page): Promise<void> {
    await expect(page.getByText(/^04[*\s]{7}\d{3}/).first()).toBeVisible();
  }

  static async retrieveLatestMFACodeFromMailosaur(receivedAfter: Date): Promise<string[]> {
    const serverId = process.env.MAILOSAUR_SERVER_ID ?? '';
    const testSms = process.env.MAILOSAUR_SMS_NUMBER ?? '';
    const bufferTimeInMs = 3000;

    const sms = await mailosaur.messages.get(
      serverId,
      {
        sentTo: testSms
      },
      {
        receivedAfter: new Date(receivedAfter.getTime() - bufferTimeInMs)
      }
    );

    const smsBody = sms?.text?.body ?? '';
    const code = smsBody?.match(/\d{6}/)?.[0];

    expect(smsBody).toContain('Your RAC - NPE verification code is');
    expect(smsBody).toContain('This code will expire in 10 minutes.');
    expect(code).toBeTruthy();

    // Convert the 6-digit code to an array of individual digits
    const codeArray = code?.split('') ?? [];

    return codeArray;
  }

  static async verifyOTP(page: Page): Promise<void> {
    try {
      await expect(page.getByText('Let’s verify it’s you')).toBeVisible();
    } catch {
      // If the user is already verified, the dialog will not be displayed
      console.log('User is already verified, skipping MFA process');
      return;
    }

    await expect(page.getByRole('button').getByText('Send code')).toBeVisible();
    
    await page.getByRole('button').getByText('Send code').click();
    await expect(
      page.getByText('Please enter the verification code to verify it’s you')
    ).toBeVisible();
    await MFAOTP.enterOTP(page);
    await expect(page.getByRole('button').getByText('Verify')).toBeVisible();
    await page.getByRole('button').getByText('Verify').click();

    // TODO: Move to common helper
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await delay(5000);
    const editLegalName = page.getByText('Please use your legal name');
    const isVisible = await editLegalName.isVisible();
    console.log(`editLegalName is visible: ${isVisible}`);
    if (isVisible) {
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByRole('heading', { name: 'Are you sure you want to' })).toBeVisible();
      await page.getByRole('button', { name: 'Yes, please cancel' }).click();
    } else {
      await page.getByRole('button').getByText('Update contacts').click();
      await expect(page.getByRole('heading', { name: 'You’ve updated your contact' })).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: 'Okay' }).click();
    }

    await delay(5000);
    // After verifed the contact should not be masked with "*"
    const contactDetailsText = await page.locator('form').filter({ hasText: 'Contact details' }).textContent();
    console.log('Contact details text:', contactDetailsText);
    expect(contactDetailsText).not.toContain('*');
  }

  static async enterOTP(page: Page) {
    // TODO: add condition to check if OTP bypass is enabled, and refactor the method
    // const timeVerifyButtonClicked = new Date();
    // const code = await this.retrieveLatestMFACodeFromMailosaur(timeVerifyButtonClicked);
    await page.getByTestId('input-otp-0').getByLabel('One time pass code input box').fill('0');
    await page.getByTestId('input-otp-1').getByLabel('One time pass code input box').fill('0');
    await page.getByTestId('input-otp-2').getByLabel('One time pass code input box').fill('0');
    await page.getByTestId('input-otp-3').getByLabel('One time pass code input box').fill('0');
    await page.getByTestId('input-otp-4').getByLabel('One time pass code input box').fill('0');
    await page.getByTestId('input-otp-5').getByLabel('One time pass code input box').fill('0');
  }
}


