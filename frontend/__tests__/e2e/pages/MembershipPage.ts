import { expect, type Page } from '@playwright/test';

export class MembershipPage {
  readonly page: Page;

  readonly membershipText;
  readonly profileLink;
  readonly copyToClipboardButton;
  readonly copiedText;
  readonly silverCardImage;
  readonly requestPlasticCardLink;
  readonly activeCardImage;
  readonly getCardText;
  readonly findOutMoreLink;
  readonly modalHeading;
  readonly modalQRCode;
  readonly modalFAQ;
  readonly modalClose;

  constructor(page: Page) {
    this.page = page;
    this.membershipText = this.page.locator('h2:has-text("Membership")');    
    this.profileLink = this.page.locator('a[href="/myrac/profile"]:has([data-icon="chevron-left"])');
    this.copyToClipboardButton = this.page.locator('[aria-label="copy to clipboard"]');
    this.copiedText = this.page.locator('text="Copied!"');
    this.silverCardImage = this.page.getByRole('img', { name: 'myRAC/card-Gold-v2' });
    this.requestPlasticCardLink = this.page.locator(
      'a[href="/myrac/profile/membership/request-a-card"]:has-text("Request a plastic card")'
    );
    this.activeCardImage = this.page.getByTestId('digital-card-front');
    this.getCardText = this.page.getByText('Get your digital card');
    this.findOutMoreLink = this.page.getByRole('button', { name: 'Find out more' });
    this.modalHeading = this.page.getByRole('heading', { name: 'Get your digital card now' });
    this.modalQRCode = this.page.getByLabel('Get your digital card now').locator('path[fill="#FFFFFF"]');
    this.modalFAQ = this.page.getByRole('link', { name: 'frequently asked questions' });
    this.modalClose = this.page.getByLabel('Close');
  }

  async verifyMembershipPage() {
    await expect(this.page).toHaveURL(/.*\/membership.*/);
    await expect(this.membershipText).toBeVisible();
    await expect(this.profileLink).toBeVisible();
    await expect(this.copyToClipboardButton).toBeVisible();

    await this.copyToClipboardButton.click();
    await expect(this.copiedText).toBeVisible();

    await expect(this.silverCardImage).toBeVisible();
    await expect(this.requestPlasticCardLink).toBeVisible();
  }

  async verifyMembershipPageWithActiveDigitalPass() {
    await expect(this.page).toHaveURL(/.*\/membership.*/);
    await expect(this.membershipText).toBeVisible();
    await expect(this.profileLink).toBeVisible();
    await expect(this.copyToClipboardButton).toBeVisible();

    await this.copyToClipboardButton.click();
    await expect(this.copiedText).toBeVisible();

    await expect(this.activeCardImage).toBeVisible();
    await expect(this.getCardText).toBeVisible();
    await expect(this.findOutMoreLink).toBeVisible();
    await this.findOutMoreLink.click();
    await this.verifyGetCardQRModal();
    await expect(this.requestPlasticCardLink).toBeVisible();
  }

  async verifyGetCardQRModal(){
    await expect(this.modalHeading).toBeVisible();
    await expect(this.modalQRCode).toBeVisible();
    await expect(this.modalFAQ).toBeVisible();
    await this.modalClose.click();
  }

  async requestPlasticCard() {
    await this.requestPlasticCardLink.click();
    await this.page.waitForURL('**/request-a-card');
  }
}
