import { expect, type Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  readonly profileHeading;
  readonly chevronLeftIcon;
  readonly myRACHomeLink;

  readonly contactDetailsHeading;
  readonly contactDetailsSubtext;

  readonly membershipHeading;
  readonly membershipSubtext;

  constructor(page: Page) {
    this.page = page;
    this.profileHeading = this.page.locator('.MuiTypography-root.MuiTypography-h2:near(a[href="/myrac"])');
    this.chevronLeftIcon = this.page.locator('[data-icon="chevron-left"]');
    this.myRACHomeLink = this.page.locator('a[href="/myrac"]:has-text("myRAC home")');
    this.contactDetailsHeading = this.page.locator(
      'a[href="/myrac/profile/contact-details"] h4:has-text("Contact details")'
    );
    this.contactDetailsSubtext = this.page.locator(
      'a[href="/myrac/profile/contact-details"] p:has-text("Including login details")'
    );
    this.membershipHeading = this.page.locator('a[href="/myrac/profile/membership"] h4:has-text("Membership")');
    this.membershipSubtext = this.page.locator('a[href="/myrac/profile/membership"] p:has-text("Card and details")');
  }

  async verifyProfilePage() {
    await expect(this.page).toHaveURL(/.*\/profile.*/);
    await expect(this.profileHeading).toBeVisible();
    await expect(this.chevronLeftIcon).toBeVisible();
    await expect(this.myRACHomeLink).toBeVisible();

    await expect(this.contactDetailsHeading).toBeVisible();
    await expect(this.contactDetailsSubtext).toBeVisible();

    await expect(this.membershipHeading).toBeVisible();
    await expect(this.membershipSubtext).toBeVisible();
  }

  async openMembershipPage() {
    await this.membershipHeading.click();
    await this.page.waitForURL('**/membership');
  }

  async openContactDetailsPage() {
    await this.contactDetailsHeading.click();
    await this.page.waitForURL('**/contact-details');
  }
}
