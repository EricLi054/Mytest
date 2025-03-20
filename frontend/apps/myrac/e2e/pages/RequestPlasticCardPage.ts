import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class RequestPlasticCardPage {
  private readonly page: Page;

  private readonly navigationElements: {
    membershipLink: Locator;
  };

  private readonly pageElements: {
    heading: Locator;
    mailingAddressText: Locator;
    requestCardButton: Locator;
    cardRequestImage: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.navigationElements = {
      membershipLink: page
        .locator("div")
        .filter({ hasText: /^Membership$/ })
        .getByRole("link"),
    };

    this.pageElements = {
      heading: page.locator('h2:near(img[alt="Card Request Image"])'),
      mailingAddressText: page.getByRole("heading", { name: "Your mailing address:" }),
      requestCardButton: page.locator('button:has-text("Request card")'),
      cardRequestImage: page.locator('img[alt="Card Request Image"]'),
    };
  }

  async verifyRequestPlasticCardPage(): Promise<void> {
    await this.verifyURL();
    await this.verifyPageElements();
  }

  private async verifyURL(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/request-a-card.*/);
  }

  private async verifyPageElements(): Promise<void> {
    await expect(this.navigationElements.membershipLink).toBeVisible();
    await expect(this.pageElements.heading).toBeVisible();
    await expect(this.pageElements.mailingAddressText).toBeVisible();
    await expect(this.pageElements.requestCardButton).toBeVisible();
    await expect(this.pageElements.cardRequestImage).toBeVisible();
  }
}
