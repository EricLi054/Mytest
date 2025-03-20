import type { Page } from "playwright/test";
import { expect } from "playwright/test";

import { RENDER_TIMEOUT } from "../utils/constants";

export default class LinkMemberPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyPageRendered(): Promise<void> {
    await expect(this.#page.getByText("Creating myRAC account")).toBeVisible(RENDER_TIMEOUT);
  }
}
