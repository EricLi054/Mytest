import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

export class SystemUnavailablePage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/system-unavailable`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async expectStaticContentToBeVisible() {
    await expect.soft(this.#page.getByText("Uh oh!", { exact: true })).toBeVisible();
    await expect.soft(this.#page.getByText("Something went wrong", { exact: true })).toBeVisible();
    await expect.soft(this.#page.getByText("Please try again later or call us on")).toBeVisible();
    await expect.soft(this.#page.getByRole("link", { name: "13 17 03" })).toBeVisible();
    await expect.soft(this.#page.getByRole("link", { name: "Back to myRAC", exact: true })).toBeVisible();
  }
}
