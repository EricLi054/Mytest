import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import type { UserType } from "../fixtures/credentials";
import { getCredentials } from "../fixtures/credentials";
import { getBaseUrl } from "../playwright-helpers/urls";

export class LoginPage {
  private page: Page;
  private pageElements: {
    signInNameInput: Locator;
    passwordInput: Locator;
    nextButton: Locator;
    racLoginText: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.pageElements = {
      signInNameInput: page.locator("#signInName"),
      passwordInput: page.locator("#password"),
      nextButton: page.locator("#next"),
      racLoginText: page.locator('[class="link-path"]'),
    };
  }

  async gotoSignIn(): Promise<void> {
    const baseUrl = getBaseUrl();
    await this.page.goto(baseUrl);
    await this.page.waitForURL(/.*b2c_1a_signuporsignin.*/);
    await expect(this.page).toHaveURL(/.*login.*/);
  }

  async verifyLoginPageElements(): Promise<void> {
    await expect(this.pageElements.racLoginText).toHaveText("RAC Log in");
    await expect(this.pageElements.signInNameInput).toHaveAttribute("placeholder", "e.g. johnsmith@domain.com");
    await expect(this.pageElements.passwordInput).toHaveAttribute("placeholder", "Enter your password");
    await expect(this.pageElements.nextButton).toHaveText("Log in");
  }

  private async performLogin(credentials: { username: string; password: string }): Promise<void> {
    await this.pageElements.signInNameInput.fill(credentials.username);
    await this.pageElements.passwordInput.fill(credentials.password);
    await this.pageElements.nextButton.click();
    await this.page.waitForURL("**/myrac");
  }

  async login(): Promise<void> {
    await this.performLogin(getCredentials("DEFAULT_USER"));
  }

  async loginAs(userType: UserType): Promise<void> {
    await this.gotoSignIn();
    await this.verifyLoginPageElements();
    await this.performLogin(getCredentials(userType));
  }

  async loginForDigitalCard(): Promise<void> {
    await this.performLogin(getCredentials("DIGITAL_CARD"));
  }
}
