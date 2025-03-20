import type { Page } from "playwright/test";
import { expect } from "playwright/test";

export default class ErrorPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyCannotFindYou(): Promise<void> {
    await expect(this.#page.getByText("Sorry, we couldn't find you")).toBeVisible();
  }
}
