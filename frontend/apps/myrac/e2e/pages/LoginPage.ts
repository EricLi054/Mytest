import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import type { UserType } from "../fixtures/credentials";
import { memberCredentials, specialCredentials, testCredentials } from "../fixtures/credentials";
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

  async goto(): Promise<void> {
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
    await this.performLogin(testCredentials.default);
  }

  async loginAs(userType: UserType): Promise<void> {
    await this.goto();
    await this.verifyLoginPageElements();
    await this.performLogin(testCredentials[userType.toLowerCase() as keyof typeof testCredentials]);
  }

  async loginAsMember(memberType: keyof typeof memberCredentials): Promise<void> {
    await this.performLogin(memberCredentials[memberType]);
  }

  async loginForDigitalCard(): Promise<void> {
    await this.performLogin(specialCredentials.digitalCard);
  }

  async loginWithActiveDigitalCard(): Promise<void> {
    await this.performLogin(specialCredentials.activeDigitalCard);
  }

  async loginForDigitalCardUAT(): Promise<void> {
    await this.performLogin(specialCredentials.cardUAT);
  }
}
