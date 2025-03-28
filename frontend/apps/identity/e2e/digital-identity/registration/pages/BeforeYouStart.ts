import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export default class BeforeYouStartPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyPageRendered(): Promise<void> {
    await expect(this.#page.getByText("Set up your digital identity")).toBeVisible();
  }

  async acceptTerms(): Promise<void> {
    await this.#page.getByRole("checkbox").click();
  }

  async submit(): Promise<void> {
    await this.#page.getByRole("button", { name: "Get started" }).click();
  }

  async completePage(): Promise<void> {
    await this.verifyPageRendered();
    await this.acceptTerms();
    await this.submit();
  }
}
