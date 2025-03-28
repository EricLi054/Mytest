import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

// import MailosaurClient from 'mailosaur';

// const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY as string);

export class MFAHelper {
  private static readonly BUFFER_TIME_MS = 3000;

  static async verifyMaskedData(page: Page): Promise<void> {
    await expect(page.getByText(/^04[*\s]{7}\d{3}/).first()).toBeVisible();
  }

  // static async retrieveLatestCode(receivedAfter: Date): Promise<string[]> {
  //   const serverId = process.env.MAILOSAUR_SERVER_ID ?? "";
  //   const testSms = process.env.MAILOSAUR_SMS_NUMBER ?? "";

  //   // const sms = await mailosaur.messages.get(
  //   //   serverId,
  //   //   { sentTo: testSms },
  //   //   { receivedAfter: new Date(receivedAfter.getTime() - this.BUFFER_TIME_MS) }
  //   // );

  //   const smsBody = sms?.text?.body ?? "";
  //   const code = smsBody?.match(/\d{6}/)?.[0];

  //   expect(smsBody).toContain("Your RAC - NPE verification code is");
  //   expect(smsBody).toContain("This code will expire in 10 minutes.");
  //   expect(code).toBeTruthy();

  //   return code?.split("") ?? [];
  // }

  static async verifyOTP(page: Page): Promise<void> {
    await expect(page.getByRole("button").getByText("Send code")).toBeVisible();
    await page.getByRole("button").getByText("Send code").click();
    await expect(page.getByText("Please enter the verification code to verify it's you")).toBeVisible();
    await this.enterOTP(page);
    await this.closeMFAModal(page);
    await this.handlePostVerification(page);
  }

  static async enterOTP(page: Page, useRealCode = false): Promise<void> {
    if (useRealCode) {
      // const code = await this.retrieveLatestCode(new Date());
      // for (let i = 0; i < 6; i++) {
      //   await page.getByTestId(`input-otp-${i}`).getByLabel("One time pass code input box").fill(code[i]);
      // }
    } else {
      // Use OTP bypass for testing
      for (let i = 0; i < 6; i++) {
        await page
          .getByTestId(`input-otp-verificationCode-input-${i}`)
          .getByLabel("One time pass code input box")
          .fill("0");
      }
    }
  }

  static async startMFA(page: Page): Promise<void> {
    await expect(page.getByRole("button").getByText("Send code")).toBeVisible();
    await page.getByRole("button").getByText("Send code").click();
    await expect(page.getByRole("heading", { name: "Enter verification code close" })).toBeVisible();
  }

  static async closeMFAModal(page: Page): Promise<void> {
    await expect(page.getByRole("button").getByText("Verify")).toBeVisible();
    await page.getByRole("button").getByText("Verify").click();
  }

  static async authenticateUserToEdit(page: Page): Promise<void> {
    try {
      await expect(page.getByText("Let's verify it's you")).toBeVisible({
        timeout: 5000,
      });
    } catch {
      console.log("User is already verified, skipping MFA process");
      return;
    }

    await expect(page.getByRole("button").getByText("Send code")).toBeVisible();
    await page.getByRole("button").getByText("Send code").click({
      timeout: 5000,
    });
    await expect(page.getByText("Please enter the verification code to verify it's you")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("button").getByText("Verify")).toBeVisible();
  }

  private static async handlePostVerification(page: Page): Promise<void> {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(5000);

    const editLegalName = page.getByText("Please use your legal name");
    if (await editLegalName.isVisible()) {
      await this.handleLegalNameDialog(page);
    } else {
      await this.handleContactUpdateDialog(page);
    }

    await delay(5000);
    const contactDetailsText = await page.locator("form").filter({ hasText: "Contact details" }).textContent();
    expect(contactDetailsText).not.toContain("*");
  }

  private static async handleLegalNameDialog(page: Page): Promise<void> {
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Are you sure you want to" })).toBeVisible();
    await page.getByRole("button", { name: "Yes, please cancel" }).click();
  }

  private static async handleContactUpdateDialog(page: Page): Promise<void> {
    await page.getByRole("button").getByText("Update contacts").click();
    await expect(page.getByRole("heading", { name: "You've updated your contact details" })).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "Okay" }).click();
  }
}
