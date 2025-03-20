import type { Page } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

export class YourVehiclePage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/your-vehicle`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async selectIsVehicleBrokenDown(isBrokenDown: "Yes" | "No") {
    await this.#page.getByRole("button", { name: isBrokenDown, exact: true }).click();
  }

  async selectVehicleUse(purpose: "Private use" | "Business use") {
    await this.#page.getByRole("button", { name: purpose, exact: true }).click();
  }

  async submit() {
    await this.#page.getByRole("button", { name: "Next", exact: true }).click();
  }
}
