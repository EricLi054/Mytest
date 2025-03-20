import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

export class ChangeAlreadyMadePage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/change-already-made`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async expectStaticContentToBeVisible() {
    await expect.soft(this.#page.getByRole("link", { name: "Back to myRAC", exact: true })).toBeVisible();
  }
}
