import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { getScreenshotDir, takeScreenshot } from "@racwa/automation";

import type { VehicleColour, VehicleRego } from "../../types";

export class UpdateVehiclePage {
  #page: Page;
  #screenshotDirPath = `${getScreenshotDir()}/update-vehicle`;

  constructor({ page }: { page: Page }) {
    this.#page = page;
  }

  async takeScreenshot({ filename }: Pick<Parameters<typeof takeScreenshot>[0], "filename">) {
    await takeScreenshot({ page: this.#page, dirPath: this.#screenshotDirPath, filename });
  }

  async selectTypeOfVehicle(vehicleType: "Car" | "Motorcycle") {
    await this.#page.getByRole("button", { name: vehicleType }).click();
  }

  async searchForVehicle(rego: VehicleRego) {
    await this.#page.getByRole("textbox").fill(rego);
    await this.#page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(this.#page.getByRole("button", { name: "Select", exact: true })).toBeVisible();
  }

  async confirmVehicle() {
    await this.#page.getByRole("button", { name: "Select", exact: true }).click();
  }

  async selectColour(colour: VehicleColour) {
    await this.#page.getByRole("combobox").click();
    await this.#page.getByText(colour, { exact: true }).click();
  }

  async submit() {
    await this.#page.getByRole("button", { name: "Next", exact: true }).click();
  }
}
