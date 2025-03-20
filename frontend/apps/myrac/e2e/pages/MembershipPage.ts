import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class MembershipPage {
  private readonly page: Page;
  private readonly pageElements: {
    membershipText: Locator;
    profileLink: Locator;
  };

  private readonly clipboardElements: {
    copyButton: Locator;
    copiedText: Locator;
  };

  private readonly cardElements: {
    digitalCard: Locator;
    requestPlasticCardLink: Locator;
    getCardText: Locator;
    findOutMoreLink: Locator;
  };

  private readonly modalElements: {
    heading: Locator;
    qrCode: Locator;
    faq: Locator;
    closeButton: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.pageElements = {
      membershipText: this.page.locator('h2:has-text("Membership")'),
      profileLink: this.page.locator('a[href="/myrac/profile"]:has([data-icon="chevron-left"])'),
    };

    this.clipboardElements = {
      copyButton: this.page.locator('[aria-label="copy to clipboard"]'),
      copiedText: this.page.locator('text="Copied!"'),
    };

    this.cardElements = {
      digitalCard: this.page.getByTestId("digital-card-front"),
      requestPlasticCardLink: this.page.locator(
        'a[href="/myrac/profile/membership/request-a-card"]:has-text("Request a plastic card")',
      ),
      getCardText: this.page.getByText("Get your digital card"),
      findOutMoreLink: this.page.getByRole("button", { name: "Find out more" }),
    };

    this.modalElements = {
      heading: this.page.getByRole("heading", { name: "Get your digital card now" }),
      qrCode: this.page.getByLabel("Get your digital card now").locator('path[fill="#FFFFFF"]'),
      faq: this.page.getByRole("link", { name: "frequently asked questions" }),
      closeButton: this.page.getByLabel("Get your digital card now").getByLabel("Close"),
    };
  }

  async verifyMembershipPage(): Promise<void> {
    await this.verifyCommonElements();
    await this.verifyClipboardFunctionality();
    await expect(this.cardElements.digitalCard).toBeVisible();
    await expect(this.cardElements.requestPlasticCardLink).toBeVisible();
  }

  async verifyMembershipPageWithActiveDigitalPass(): Promise<void> {
    await this.verifyCommonElements();
    await this.verifyClipboardFunctionality();
    await this.verifyDigitalCardElements();
    await this.verifyGetCardQRModal();
    await expect(this.cardElements.requestPlasticCardLink).toBeVisible();
  }

  private async verifyCommonElements(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/membership.*/);
    await expect(this.pageElements.membershipText).toBeVisible();
    await expect(this.pageElements.profileLink).toBeVisible();
    await expect(this.clipboardElements.copyButton).toBeVisible();
  }

  private async verifyClipboardFunctionality(): Promise<void> {
    await this.clipboardElements.copyButton.click();
    await expect(this.clipboardElements.copiedText).toBeVisible();
  }

  private async verifyDigitalCardElements(): Promise<void> {
    await expect(this.cardElements.digitalCard).toBeVisible();
    await expect(this.cardElements.getCardText).toBeVisible();
    await expect(this.cardElements.findOutMoreLink).toBeVisible();
    await this.cardElements.findOutMoreLink.click();
  }

  async verifyGetCardQRModal(): Promise<void> {
    await expect(this.modalElements.heading).toBeVisible();
    await expect(this.modalElements.qrCode).toBeVisible();
    await expect(this.modalElements.faq).toBeVisible();
    await this.modalElements.closeButton.click();
  }

  async requestPlasticCard(): Promise<void> {
    await this.cardElements.requestPlasticCardLink.click();
    await this.page.waitForURL("**/request-a-card");
  }
}
