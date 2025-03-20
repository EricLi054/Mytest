import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

export class ConfirmationPage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/confirmation`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async expectStaticContentToBeVisible({ firstName }: { firstName: string }) {
    await expect.soft(this.#page.getByText(`You're all set, ${firstName}!`, { exact: true })).toBeVisible();
    await expect.soft(this.#page.getByRole("link", { name: "Back to myRAC", exact: true })).toBeVisible();
  }
}
