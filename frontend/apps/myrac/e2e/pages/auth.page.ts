import type { Page } from "@playwright/test";

import { getKeyvaultSecret } from "@racwa/automation";

import { urls } from "../playwright-helpers/urls";

export class AuthPage {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async login(username?: string, password?: string): Promise<void> {
    if (!username || !password) {
      const credentials = await this.getCredentialsFromKeyVault();
      username = credentials.username;
      password = credentials.password;
    }

    await this.page.goto(urls.landing, {
      waitUntil: "domcontentloaded",
    });

    await this.fillLoginForm(username, password);
    await this.submitLoginForm();
    await this.waitForSuccessfulLogin();
  }

  async logout(): Promise<void> {
    await this.page.goto(urls.logout);
    await this.page.waitForURL(urls.login);
  }

  private async getCredentialsFromKeyVault(): Promise<{ username: string; password: string }> {
    const usernameResult = await getKeyvaultSecret("myrac-username");
    const passwordResult = await getKeyvaultSecret("myrac-password");

    if (!usernameResult.success || !passwordResult.success) {
      throw new Error("Unable to retrieve credentials from Key Vault");
    }

    return {
      username: usernameResult.secret,
      password: passwordResult.secret,
    };
  }

  private async fillLoginForm(username: string, password: string): Promise<void> {
    await this.page.fill("#username", username);
    await this.page.fill("#password", password);
  }

  private async submitLoginForm(): Promise<void> {
    await this.page.click("#login");
  }

  private async waitForSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL(urls.landing, {
      waitUntil: "commit",
    });
  }
}

export const createAuthPage = (page: Page) => new AuthPage(page);
