import { expect, type Page } from '@playwright/test';

export class RequestPlasticCardPage {
  readonly page: Page;

  readonly membershipLink;
  readonly requestPlasticCardHeading;
  readonly mailingAddressText;
  readonly requestCardButton;
  readonly cardRequestImage;

  constructor(page: Page) {
    this.page = page;
    this.membershipLink = this.page.locator('div').filter({ hasText: /^Membership$/ }).getByRole('link')
    this.requestPlasticCardHeading = this.page.locator('h2:near(img[alt="Card Request Image"])');
    this.mailingAddressText = this.page.locator('.MuiGrid-root.MuiGrid-item h5:has-text("Your mailing address")');
    this.requestCardButton = this.page.locator('button:has-text("Request card")');
    this.cardRequestImage = this.page.locator('img[alt="Card Request Image"]');
  }

  async verifyRequestPlasticCardPage() {
    await expect(this.page).toHaveURL(/.*\/request-a-card.*/);
    await expect(this.membershipLink).toBeVisible();
    await expect(this.requestPlasticCardHeading).toBeVisible();

    await expect(this.mailingAddressText).toBeVisible();

    await expect(this.requestCardButton).toBeVisible();
    await expect(this.cardRequestImage).toBeVisible();
  }
}
