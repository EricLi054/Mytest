import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class ProfilePage {
  private readonly page: Page;
  private readonly headerElements: {
    profileHeading: Locator;
    chevronLeftIcon: Locator;
    myRACHomeLink: Locator;
  };

  private readonly contactElements: {
    heading: Locator;
    subtext: Locator;
    link: Locator;
  };

  private readonly membershipElements: {
    heading: Locator;
    subtext: Locator;
    link: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.headerElements = {
      profileHeading: this.page.locator('.MuiTypography-root.MuiTypography-h2:near(a[href="/myrac"])'),
      chevronLeftIcon: this.page.locator('[data-icon="chevron-left"]'),
      myRACHomeLink: this.page.locator('a[href="/myrac"]:has-text("myRAC home")'),
    };

    this.contactElements = {
      heading: this.page.getByRole("heading", { name: "Contact details" }),
      subtext: this.page.getByText("Including login details"),
      link: this.page.getByRole("link", { name: "Contact details Including login details" }),
    };

    const membershipSelector = 'a[href="/myrac/profile/membership"]';
    this.membershipElements = {
      heading: this.page.locator(`${membershipSelector} h4:has-text("Membership")`),
      subtext: this.page.locator(`${membershipSelector} p:has-text("Card and details")`),
      link: this.page.locator(membershipSelector),
    };
  }

  async verifyProfilePage(): Promise<void> {
    await this.verifyHeader();
    await this.verifyContactSection();
    await this.verifyMembershipSection();
  }

  private async verifyHeader(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/profile.*/);
    await expect(this.headerElements.profileHeading).toBeVisible();
    await expect(this.headerElements.chevronLeftIcon).toBeVisible();
    await expect(this.headerElements.myRACHomeLink).toBeVisible();
  }

  private async verifyContactSection(): Promise<void> {
    await expect(this.contactElements.heading).toBeVisible();
    await expect(this.contactElements.subtext).toBeVisible();
  }

  private async verifyMembershipSection(): Promise<void> {
    await expect(this.membershipElements.heading).toBeVisible();
    await expect(this.membershipElements.subtext).toBeVisible();
  }

  async openMembershipPage(): Promise<void> {
    await this.membershipElements.link.click();
    await this.page.waitForURL("**/membership");
  }

  async openContactDetailsPage(): Promise<void> {
    await this.contactElements.link.click();
    await this.page.waitForURL("**/contact-details");
  }
}
