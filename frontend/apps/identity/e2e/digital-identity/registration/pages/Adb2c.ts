import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { ADB2C_EMAIL, ADB2C_PASSWORD, RENDER_TIMEOUT } from "../utils/constants";
import { retrieveRegistrationCodeFromMailosaur } from "../utils/mailosaur";

export default class Adb2cPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyRegisterPageRendered(): Promise<void> {
    await expect(this.#page.getByRole("heading", { name: "Register for RAC WA" })).toBeVisible(RENDER_TIMEOUT);
  }

  async verifyPasswordPageRendered(): Promise<void> {
    await expect(this.#page.getByText("Create password")).toBeVisible(RENDER_TIMEOUT);
  }

  async enterEmail(email: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. johnsmith@domain.com").fill(email);
  }

  async enterVerificationCode(code: string): Promise<void> {
    await this.#page.getByPlaceholder("Enter verification code").fill(code);
  }

  async enterPassword(password: string): Promise<void> {
    await this.#page.getByLabel("New Password", { exact: true }).fill(password);
  }

  async enterPasswordConfirmation(password: string): Promise<void> {
    await this.#page.getByLabel("Confirm New Password", { exact: true }).fill(password);
  }

  async clickSendCode(): Promise<void> {
    await this.#page.getByRole("button", { name: "Send verification code" }).click();
    await expect(this.#page.getByText("We have emailed a verification code to you.")).toBeVisible();
  }

  async clickVerifyCode(): Promise<void> {
    await this.#page.getByRole("button", { name: "Verify code" }).click();
  }

  async clickAcceptTerms(): Promise<void> {
    await this.#page.getByRole("checkbox").click();
  }

  async clickSavePassword(): Promise<void> {
    await this.#page.getByRole("button", { name: "Register" }).click();
  }

  async completePage(): Promise<void> {
    await this.verifyRegisterPageRendered();
    await this.enterEmail(ADB2C_EMAIL);
    const timeVerifyButtonClicked = new Date();
    await this.clickSendCode();
    const mailosaurCode = await retrieveRegistrationCodeFromMailosaur(ADB2C_EMAIL, timeVerifyButtonClicked);
    await this.enterVerificationCode(mailosaurCode);
    await this.clickVerifyCode();
    await this.verifyPasswordPageRendered();
    await this.enterPassword(ADB2C_PASSWORD);
    await this.enterPasswordConfirmation(ADB2C_PASSWORD);
    await this.clickAcceptTerms();
    await this.clickSavePassword();
  }
}
