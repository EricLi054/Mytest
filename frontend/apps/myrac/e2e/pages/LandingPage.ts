import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { MembershipPage } from "./MembershipPage";

export class LandingPage {
  private readonly page: Page;
  private readonly headerElements: {
    userIcon: Locator;
    welcomeText: Locator;
    myRACText: Locator;
    userMenuButton: Locator;
    profileLink: Locator;
    moreMenuButton: Locator;
    profileLinkMobile: Locator;
  };

  private readonly membershipElements: {
    memberTierText: Locator;
    copyButton: Locator;
    copiedText: Locator;
    digitalCardButton: Locator;
  };

  private readonly cardElements: {
    card: Locator;
    eyeIcon: Locator;
    cardText: Locator;
    addCardTooltip: Locator;
  };

  private readonly policyElements: {
    manageButton: Locator;
    managePolicyText: Locator;
    updateHowYouPayText: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.headerElements = {
      userIcon: page.getByRole("button", { name: "user-menu-toggle" }).locator('[data-icon="user"]'),
      welcomeText: page.getByText("welcome back"),
      myRACText: page.locator('.MuiTypography-root.MuiTypography-h2:near(:text("welcome back"))'),
      userMenuButton: page.getByRole("button", { name: "user-menu-toggle" }).locator('[data-icon="caret-down"]'),
      moreMenuButton: page.getByRole("button", { name: "More" }),
      profileLink: page.locator('#user-menu a[href="/myrac/profile"]'),
      profileLinkMobile: page.getByRole("banner").getByRole("link", { name: "Profile" }),
    };

    this.membershipElements = {
      memberTierText: page.locator('p:has-text("member"):near([aria-label="copy to clipboard"])'),
      copyButton: page.locator('[aria-label="copy to clipboard"]'),
      copiedText: page.locator("text=Copied!"),
      digitalCardButton: page.locator('a[gavalue="Digital card - Profile button click"]'),
    };

    this.cardElements = {
      card: page.locator('img[alt="myRAC/card-Silver-No-Text"]'),
      eyeIcon: page.locator('[data-icon="eye"]'),
      cardText: page.getByText("Digital card"),
      addCardTooltip: page.locator('text="Add card to your mobile wallet"'),
    };

    this.policyElements = {
      manageButton: page.getByText("Manage"),
      managePolicyText: page.getByText("Manage your policy"),
      updateHowYouPayText: page.getByText("Update how you pay"),
    };
  }

  async verifyLandingPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/myrac.*/);

    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    if (isMobile) {
      // Mobile-specific verification
      // Mobile might have a hamburger menu instead of visible user icon
      await expect(this.page.getByRole("button", { name: "More" })).toBeVisible();
      await expect(this.headerElements.welcomeText).toBeVisible();
    } else {
      await expect(this.headerElements.userIcon).toBeVisible();
      await expect(this.headerElements.welcomeText).toBeVisible();
    }
  }

  async verifyLandingPageWithDigitalPass(): Promise<void> {
    await this.verifyLandingPage();
  }

  async verifyDigitalCardWithDigitalPass(): Promise<void> {
    await this.verifyLandingPage();
    await this.verifyCardDetails();
    await this.verifyAddCardMessage();
  }

  async verifyCardDetails(): Promise<void> {
    await expect(this.cardElements.card).toBeVisible();
    await expect(this.cardElements.eyeIcon).toBeVisible();
    await expect(this.cardElements.cardText).toBeVisible();
  }

  async verifyAddCardMessage(): Promise<void> {
    const membershipPage = new MembershipPage(this.page);
    await this.handleDigitalCardInitial();
    await expect(this.cardElements.addCardTooltip).toBeVisible();
    await this.cardElements.eyeIcon.click();
    await membershipPage.verifyGetCardQRModal();
    await this.verifyDigitalCardInitialState();
  }

  private async handleDigitalCardInitial(): Promise<void> {
    const digitalCardInitial = await this.getDigitalCardInitial();
    if (digitalCardInitial) {
      await this.clearDigitalCardInitial();
    }
  }

  private async getDigitalCardInitial(): Promise<{ count: number } | null> {
    return await this.page.evaluate((): { count: number } | null => {
      const storedData = localStorage.getItem("digital-card-initial");
      return storedData ? (JSON.parse(storedData) as { count: number }) : null;
    });
  }

  private async clearDigitalCardInitial(): Promise<void> {
    await this.page.evaluate((): void => {
      localStorage.removeItem("digital-card-initial");
    });
  }

  private async verifyDigitalCardInitialState(): Promise<void> {
    const digitalCardInitial = await this.getDigitalCardInitial();
    if (!digitalCardInitial) {
      throw new Error("Digital card initial state is null");
    }
    expect(digitalCardInitial.count).toBe(1);
    await expect(this.cardElements.addCardTooltip).not.toBeVisible();
  }

  async verifyManagePolicy(): Promise<void> {
    await this.policyElements.manageButton.first().click();
    await expect(this.policyElements.managePolicyText).toBeVisible();
  }

  async verifyOtherProduct(): Promise<void> {
    await this.page.getByRole("link", { name: "Life Insurance Life Insurance" }).click();
    await this.page.waitForURL("**/life-insurance", { waitUntil: "domcontentloaded" });
    await expect(this.page.locator(".page-header.photo-bg").first()).toBeVisible();
  }

  async verifyUpdateHowYouPay(): Promise<void> {
    const insuranceType = await this.getVisibleInsuranceType();
    const query = `button:right-of(:text("${insuranceType}")):has-text("Manage")`;
    await this.page.locator(query).first().click();
    await expect(this.policyElements.updateHowYouPayText).toBeVisible();
  }

  private async getVisibleInsuranceType(): Promise<string> {
    const hasCarInsurance = (await this.page.getByRole("heading", { name: "Car Insurance" }).count()) > 0;
    return hasCarInsurance ? "Car Insurance" : "Home Insurance";
  }

  async validateMemberTier(expectedTier: string, expectedCard: string): Promise<void> {
    await expect(this.membershipElements.memberTierText).toContainText(expectedTier);
    await expect(this.page.getByRole("img", { name: expectedCard })).toBeVisible();
  }

  async verifyDigitalCardFeature(): Promise<void> {
    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    await expect(this.headerElements.welcomeText).toBeVisible();
    await this.membershipElements.copyButton.click();
    await expect(this.membershipElements.copiedText).toBeVisible();

    if (isMobile) {
      await this.headerElements.moreMenuButton.click();
      await expect(this.headerElements.profileLinkMobile).toBeVisible();
    } else {
      await this.headerElements.userMenuButton.click();
      await expect(this.headerElements.profileLink).toBeVisible();
    }

    await expect(this.membershipElements.digitalCardButton).toBeVisible();
  }

  async openProfilePage(): Promise<void> {
    await this.membershipElements.digitalCardButton.click();
    await this.page.waitForURL("**/profile");
  }
}
