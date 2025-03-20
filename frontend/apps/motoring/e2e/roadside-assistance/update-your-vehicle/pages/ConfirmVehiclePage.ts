import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

import type { VehicleColour, VehicleRego } from "../../types";

export class ConfirmVehiclePage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/confirm-vehicle`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async expectStaticContentToBeVisible({ rego, colour }: { rego: VehicleRego; colour: VehicleColour }) {
    await expect.soft(this.#page.getByText(`Registration: ${rego}`, { exact: true })).toBeVisible();
    await expect.soft(this.#page.getByText(`Vehicle colour: ${colour}`, { exact: true })).toBeVisible();
  }

  async submit() {
    await this.#page.getByRole("button", { name: "Confirm", exact: true }).click();
  }
}
