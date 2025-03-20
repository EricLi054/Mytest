import { type Page } from '@playwright/test';
import { urls } from './urls';
import { UserType, getCredentials } from '../fixtures/credentials';

export class Auth {
  constructor(private page: Page) {}

  async loginAs(userType: UserType = 'DEFAULT_USER'): Promise<void> {
    const credentials = getCredentials(userType);
    await this.login(credentials.username, credentials.password);
  }

  async login(
    username: string = process.env.PLAYWRIGHT_DEFAULT_USERNAME ?? '',
    password: string = process.env.PLAYWRIGHT_DEFAULT_PASSWORD ?? ''
  ): Promise<void> {
    await this.page.goto(urls.landing, {
      waitUntil: 'domcontentloaded'
    });

    await this.fillLoginForm(username, password);
    await this.submitLoginForm();
    await this.waitForSuccessfulLogin();
  }

  async logout(): Promise<void> {
    await this.page.goto(urls.logout);
    await this.page.waitForURL(urls.login);
  }

  private async fillLoginForm(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username-input').fill(username);
    await this.page.getByTestId('password-input').fill(password);
  }

  private async submitLoginForm(): Promise<void> {
    await this.page.getByTestId('login-button').click();
  }

  private async waitForSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL(urls.landing, {
      waitUntil: 'commit'
    });
  }
}

export const createAuth = (page: Page) => new Auth(page);
