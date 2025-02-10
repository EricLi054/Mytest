import { expect, type Locator, type Page } from '@playwright/test';
import { MembershipPage } from './MembershipPage';

export class LandingPage {
  readonly page: Page;
  readonly userIcon: Locator;
  readonly welcomeText: Locator;
  readonly manageButton: Locator;
  readonly managePolicyText: Locator;
  readonly updateHowYouPayText: Locator;
  readonly memberTierText: Locator;
  readonly myRACText: Locator;
  readonly digitalCardButton: Locator;
  readonly userMenuButton: Locator;
  readonly profileLink: Locator;
  readonly copyButton: Locator;
  readonly copiedText: Locator;
  readonly card: Locator;
  readonly cardEyeIcon: Locator;
  readonly cardText: Locator;
  readonly addCardTooltip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userIcon = page.getByRole('button', { name: 'user-menu-toggle' }).locator('[data-icon="user"]');
    this.welcomeText = page.getByText('welcome back');
    this.manageButton = page.getByText('Manage');
    this.managePolicyText = page.getByText('Manage your policy');
    this.updateHowYouPayText = page.getByText('Update how you pay');
    this.memberTierText = page.locator('p:has-text("member"):near([aria-label="copy to clipboard"])');
    this.copyButton = page.locator('[aria-label="copy to clipboard"]');
    this.copiedText = page.locator('text=Copied!');
    this.myRACText = page.locator('.MuiTypography-root.MuiTypography-h2:near(:text("welcome back"))');
    this.digitalCardButton = page.locator('a[gavalue="Digital card - Profile button click"]');
    this.userMenuButton = page.getByRole('button', { name: 'user-menu-toggle' }).locator('[data-icon="caret-down"]');
    this.profileLink = page.locator('#user-menu a[href="/myrac/profile"]');
    this.card = this.page.locator('img[alt="myRAC/card-Silver-No-Text"]');
    this.cardEyeIcon = this.page.locator('[data-icon="eye"]');
    this.cardText = this.page.getByText('Digital card');
    this.addCardTooltip = this.page.locator('text="Add card to your mobile wallet"');
  }

  async verifyLandingPage() {
    await expect(this.page).toHaveURL(/.*\/myrac.*/);
    await expect(this.userIcon).toBeVisible();
    await expect(this.welcomeText).toBeVisible();
  }

  async verifyLandingPageWithDigitalPass() {
    await expect(this.page).toHaveURL(/.*\/myrac.*/);
    await expect(this.userIcon).toBeVisible();
    await expect(this.welcomeText).toBeVisible();
  }

  async verifyDigitalCardWithDigitalPass() {
    await expect(this.page).toHaveURL(/.*\/myrac.*/);
    await expect(this.userIcon).toBeVisible();
    await expect(this.welcomeText).toBeVisible();
    this.verifyCardDetails();
    this.verifyAddCardMessage();
  }

  async verifyCardDetails() {
    await expect(this.card).toBeVisible();
    await expect(this.cardEyeIcon).toBeVisible();
    await expect(this.cardText).toBeVisible();
  }

  async verifyAddCardMessage() {
    const membershipPage = new MembershipPage(this.page);
  
    let digitalCardInitial = await this.page.evaluate(() => {
      const storedData = localStorage.getItem('digital-card-initial');
      return storedData ? JSON.parse(storedData) : null;
    });
  
    if (digitalCardInitial) {
      await this.page.evaluate(() => {
        localStorage.removeItem('digital-card-initial');
      });
    }
  
    await expect(this.addCardTooltip).toBeVisible();
    await this.cardEyeIcon.click();
    await membershipPage.verifyGetCardQRModal();
  
    digitalCardInitial = await this.page.evaluate(() => {
      const storedData = localStorage.getItem('digital-card-initial');
      return storedData ? JSON.parse(storedData) : null;
    });
  
    expect(digitalCardInitial).not.toBeNull();
    expect(digitalCardInitial.count).toBe(1);
  
    await expect(this.addCardTooltip).not.toBeVisible();
  }
  
  

  async verifyManagePolicy() {
    await this.manageButton.first().click();
    await expect(this.managePolicyText).toBeVisible();
  }

  async verifyOtherProduct() {
    await this.page.getByRole('link', { name: 'Life Insurance Life Insurance' }).click();
    await this.page.waitForURL('**/life-insurance', {
      waitUntil: 'domcontentloaded'
    });
    await expect(this.page.locator('.page-header.photo-bg').first()).toBeVisible();
  }

  async verifyUpdateHowYouPay() {
    const hasCarInsurance = (await this.page.getByRole('heading', { name: 'Car Insurance' }).count()) > 0;
    const hasHomeInsurance = (await this.page.getByRole('heading', { name: 'Home Insurance' }).count()) > 0;

    expect(hasCarInsurance || hasHomeInsurance).toBeTruthy();
    const query = `button:right-of(:text("${hasCarInsurance ? 'Car Insurance' : 'Home Insurance'}")):has-text("Manage")`;
    await this.page.locator(query).first().click();

    await expect(this.page.getByText('Update how you pay')).toBeVisible();
  }

  async validateMemberTier(expectedTier: string, expectedCard: string) {
    await expect(this.memberTierText).toContainText(expectedTier);
    await expect(this.page.getByRole('img', { name: expectedCard })).toBeVisible();
  }

  async verifyDigitalCardFeature() {
    await expect(this.myRACText).toHaveText('myRAC');
    await expect(this.welcomeText).toBeVisible();
    await this.copyButton.click();
    await expect(this.copiedText).toBeVisible();
    await this.userMenuButton.click();
    await expect(this.profileLink).toBeVisible();

    await expect(this.digitalCardButton).toBeVisible();
  }

  async openProfilePage() {
    await this.digitalCardButton.click();
    await this.page.waitForURL('**/profile');
  }
}
