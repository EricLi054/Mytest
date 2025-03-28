import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { RENDER_TIMEOUT } from "../utils/constants";

export default class MyRacPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyPageRendered(): Promise<void> {
    await expect(this.#page.getByRole("heading", { name: "Welcome back", exact: false })).toBeVisible(RENDER_TIMEOUT);
  }
}
