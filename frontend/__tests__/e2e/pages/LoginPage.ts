import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signInNameInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly racLoginText: Locator;
  readonly userEmail: string | undefined = process.env.PLAYWRIGHT_BLUE_MEMBER;
  readonly userPassword: string | undefined = process.env.PLAYWRIGHT_BLUE_PASSWORD;
  readonly digitalCardUser: string | undefined = process.env.REQUEST_PLASTIC_CARD_MEMBER;
  readonly digitalCardPwd: string | undefined = process.env.REQUEST_PLASTIC_CARD_PASSWORD;
  readonly activeDigitalCardUser: string | undefined = process.env.ACTIVE_DIGITAL_CARD_MEMBER;
  readonly activeDigitalCardPwd: string | undefined = process.env.ACTIVE_DIGITAL_CARD_PASSWORD;

  constructor(page: Page) {
    this.page = page;
    this.signInNameInput = page.locator('#signInName');
    this.passwordInput = page.locator('#password');
    this.nextButton = page.locator('#next');
    this.racLoginText = page.locator('[class="link-path"]');
  }

  readonly memberCredentials = {
    'Blue member': {
      username: process.env.PLAYWRIGHT_BLUE_MEMBER || '',
      password: process.env.PLAYWRIGHT_BLUE_PASSWORD || ''
    },
    'Bronze member': {
      username: process.env.PLAYWRIGHT_BRONZE_MEMBER || '',
      password: process.env.PLAYWRIGHT_BRONZE_PASSWORD || ''
    },
    'Red member': {
      username: process.env.PLAYWRIGHT_RED_MEMBER || '',
      password: process.env.PLAYWRIGHT_RED_PASSWORD || ''
    },
    'Silver member': {
      username: process.env.PLAYWRIGHT_Silver_MEMBER || '',
      password: process.env.PLAYWRIGHT_Silver_PASSWORD || ''
    },
    'Gold member': {
      username: process.env.PLAYWRIGHT_Gold_MEMBER || '',
      password: process.env.PLAYWRIGHT_Gold_PASSWORD || ''
    },
    'Gold Life member': {
      username: process.env.PLAYWRIGHT_GoldLife_MEMBER || '',
      password: process.env.PLAYWRIGHT_GoldLife_PASSWORD || ''
    },
    'Staff member': {
      username: process.env.PLAYWRIGHT_Staff_MEMBER || '',
      password: process.env.PLAYWRIGHT_Staff_PASSWORD || ''
    },
    'Free2Go member': {
      username: process.env.PLAYWRIGHT_Free2Go_MEMBER || '',
      password: process.env.PLAYWRIGHT_Free2Go_PASSWORD || ''
    },
    'RAC Ignite member': {
      username: process.env.PLAYWRIGHT_Ignite_MEMBER || '',
      password: process.env.PLAYWRIGHT_Ignite_PASSWORD || ''
    }
  };

  async goto() {
    const baseUrl = process.env.PLAYWRIGHT_BASE_SIT_URL;
    // const baseUrl = process.env.PLAYWRIGHT_BASE_UAT_URL;
    if (!baseUrl) {
      throw new Error('Base URL is not defined in the environment variables');
    }
    await this.page.goto(baseUrl);
    await this.page.waitForURL(/.*b2c_1a_signuporsignin.*/);
    await expect(this.page).toHaveURL(/.*login.*/);
  }

  async gotoWithDigitalPass() {
    const baseUrl = process.env.PLAYWRIGHT_BASE_SIT_URL;
    // const baseUrl = process.env.PLAYWRIGHT_BASE_UAT_URL;
    if (!baseUrl) {
      throw new Error('Base URL is not defined in the environment variables');
    }
    await this.page.goto(baseUrl);
    await this.page.waitForURL(/.*b2c_1a_signuporsignin.*/);
    await expect(this.page).toHaveURL(/.*login.*/);
  }

  async verifyLoginPageElements() {
    await expect(this.racLoginText).toHaveText('RAC Log in');
    await expect(this.signInNameInput).toHaveAttribute('placeholder', 'e.g. johnsmith@domain.com');
    await expect(this.passwordInput).toHaveAttribute('placeholder', 'Enter your password');

    await expect(this.nextButton).toHaveText('Log in');
  }

  async login() {
    await this.signInNameInput.fill(this.userEmail || '');
    await this.passwordInput.fill(this.userPassword || '');
    await this.nextButton.click();
    await this.page.waitForURL('**/myrac');
  }

  async loginEach(username: string, password: string) {
    await this.signInNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.nextButton.click();
    await this.page.waitForURL('**/myrac');
  }

  async loginForDigitalCard() {
    await this.signInNameInput.fill(this.digitalCardUser || '');
    await this.passwordInput.fill(this.digitalCardPwd || '');
    await this.nextButton.click();
    await this.page.waitForURL('**/myrac');
  }

  async loginWithActiveDigitalCard() {
    await this.signInNameInput.fill(this.activeDigitalCardUser || '');
    await this.passwordInput.fill(this.activeDigitalCardPwd || '');
    await this.nextButton.click();
    await this.page.waitForURL('**/myrac');
  }
}
