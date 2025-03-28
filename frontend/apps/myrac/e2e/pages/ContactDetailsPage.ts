import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { MFAHelper } from "../playwright-helpers/mfa";

export class ContactDetailsPage {
  private readonly page: Page;

  private readonly pageElements: {
    profileLink: Locator;
    contactDetailsHeadings: Locator;
  };

  private readonly nameSection: {
    container: Locator;
    memberName: Locator;
    editButton: Locator;
  };

  private readonly contactSection: {
    container: Locator;
    editButton: Locator;
    mobileNumber: Locator;
    homeNumber: Locator;
    workNumber: Locator;
    contactEmail: Locator;
    mailingAddress: Locator;
  };

  private readonly loginSection: {
    container: Locator;
    email: Locator;
    password: Locator;
    editButton: Locator;
  };

  private readonly mfaElements: {
    modalTitle: Locator;
    faqMessage: Locator;
    helpCenterMessage: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.pageElements = {
      profileLink: page.locator('a[href="/myrac/profile"]:has([data-icon="chevron-left"])'),
      contactDetailsHeadings: page.locator('h2:has-text("Your contact details")'),
    };

    this.nameSection = {
      container: page.locator('h3:has-text("Name")'),
      memberName: page.locator('p[name="display"]'),
      editButton: page.locator("form").filter({ hasText: "Name" }).getByRole("button"),
    };

    this.contactSection = {
      container: page.locator('h3:has-text("Contact details")'),
      editButton: page.locator("form").filter({ hasText: "Contact details" }).getByRole("button"),
      mobileNumber: page.locator('p[name="mobile-display"]'),
      homeNumber: page.locator('p[name="home-display"]'),
      workNumber: page.locator('p[name="work-display"]'),
      contactEmail: page.locator('p[name="email-display"]'),
      mailingAddress: page.locator('p[name="address-display"]'),
    };

    this.loginSection = {
      container: page.locator('h3:has-text("Log-in details")'),
      email: page
        .locator("form")
        .filter({ hasText: "Log-in details" })
        .locator('h6:has-text("@"):has-text("mailosaur.net")'),
      password: page.locator("form").filter({ hasText: "Log-in details" }).locator('h6:has-text("**********")'),
      editButton: page.locator("form").filter({ hasText: "Log-in details" }).getByRole("link").first(),
    };

    this.mfaElements = {
      modalTitle: page.getByRole("heading", { name: "Let's verify it's you close" }),
      faqMessage: page.locator('p:has-text("Need help? Visit our FAQs")'),
      helpCenterMessage: page.locator('p:has-text("Not your number? Call 13 17 03")'),
    };
  }

  private readonly PAYMENT_STEPS = [
    "1. Go to myRAC homepage.",
    "2. Select the item you'd like to update.",
    "3. Select 'Manage'.",
  ] as const;

  async editContactDetails(): Promise<void> {
    await this.clickRandomEditButton();
    await this.verifyMFAModal();
  }

  async clickRandomEditButton(): Promise<void> {
    const buttons = [this.nameSection.editButton, this.contactSection.editButton, this.loginSection.editButton];

    const randomIndex = Math.floor(Math.random() * buttons.length);
    const selectedButton = buttons.at(randomIndex);

    if (!selectedButton) {
      throw new Error("No button selected");
    }
    await selectedButton.click();
  }

  async verifyMFAModal() {
    await expect(this.mfaElements.modalTitle).toHaveText("Let's verify it's you");
    await expect(this.mfaElements.faqMessage).toBeVisible();
    await expect(this.mfaElements.helpCenterMessage).toBeVisible();
    await MFAHelper.verifyOTP(this.page);

    // TODO: Implement fetching OTP from mailosaur
    // const sendCodeNumber = await this.codeVerificationNumber.textContent().trim(first two digits);
    // const alternativePhoneOption = await this.alternativePhoneOption.textContent();
    // if (sendCodeNumber === '04') {
    //   await expect(alternativePhoneOption).toHaveText('Get code via phone call');
    //   await expect(this.sendCodeButton).toBeVisible();
    //   await expect(this.sendCodeButton).click();
    //   await expect(this.enterVerificationCode).toBeVisible();
    //   await expect(this.sendNewCode).toBeVisible();
    //   await enterOTP();

    // } else {
    //   await expect(alternativePhoneOption).toHaveText('Send code via SMS');
    // }
  }

  async verifyContactDetailsPage() {
    await expect(this.page).toHaveURL(/.*\/contact-details.*/);
    await this.page.waitForSelector('h2:has-text("Your contact details")', { state: "visible" });
    await expect(this.pageElements.contactDetailsHeadings).toBeVisible();
    await expect(this.pageElements.profileLink).toBeVisible();

    await expect(this.nameSection.container).toBeVisible();
    await expect(this.nameSection.memberName).toBeVisible();
    await expect(this.nameSection.editButton).toBeVisible();

    await expect(this.contactSection.container).toBeVisible();
    await expect(this.contactSection.editButton).toBeVisible();
    await this.verifyMaskedMobileNumber();
    await this.verifyNotProvidedPhoneNumber();
    await this.verifyContactEmail();
    await this.verifyMailingAddress();

    await expect(this.loginSection.container).toBeVisible();
    await expect(this.loginSection.email).toBeVisible();
    await expect(this.loginSection.password).toBeVisible();
    await expect(this.loginSection.editButton).toBeVisible();

    await this.verifyPaymentSteps();
  }

  async verifyMaskedMobileNumber() {
    await expect(this.contactSection.mobileNumber).toBeVisible();

    const mobileNumberText = await this.contactSection.mobileNumber.textContent();
    const maskedMobileNumberPattern = /^04\*\* \*\*\* \d{3}$/;

    expect(mobileNumberText).toMatch(maskedMobileNumberPattern);
  }

  async verifyNotProvidedPhoneNumber() {
    const phoneNumbers = [
      this.contactSection.mobileNumber,
      this.contactSection.homeNumber,
      this.contactSection.workNumber,
    ];

    for (const phoneNumber of phoneNumbers) {
      const phoneNumberText = await phoneNumber.textContent();
      const containsDigits = phoneNumberText ? /\d/.test(phoneNumberText) : false;

      if (!containsDigits) {
        await expect(phoneNumber).toHaveText("Not Provided");
      }
    }
  }

  async verifyContactEmail() {
    await expect(this.contactSection.contactEmail).toBeVisible();

    const contactEmailText = await this.contactSection.contactEmail.textContent();
    const emailPattern = /^.\*{10}.*$/;

    expect(contactEmailText).toMatch(emailPattern);
  }

  async verifyMailingAddress() {
    await expect(this.contactSection.mailingAddress).toBeVisible();

    const mailingAddressText = await this.contactSection.mailingAddress.textContent();
    const addressPattern = /^\*.*$/;

    expect(mailingAddressText).toMatch(addressPattern);
  }

  async verifyPaymentSteps() {
    for (const step of this.PAYMENT_STEPS) {
      const stepLocator = this.page.locator(`p:has-text("${step}")`);
      await expect(stepLocator).toBeVisible();
    }
  }

  async updateAddress(address: string) {
    await this.contactSection.editButton.click();
    await MFAHelper.startMFA(this.page);
    await MFAHelper.enterOTP(this.page);
    await MFAHelper.closeMFAModal(this.page);
    await this.page.getByPlaceholder("e.g. 832 Wellington Street,").fill(address);
    await this.page.waitForSelector('[role="listbox"]');
    await this.page.getByPlaceholder("e.g. 832 Wellington Street,").press("Enter");
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(5000);
    await this.page.getByRole("button", { name: "Update contacts" }).click();
    await this.page.getByRole("button", { name: "Okay" }).click();
  }

  async verifyAddressUpdate(expectedAddress: string) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(5000);
    await expect(this.contactSection.mailingAddress).toHaveText(expectedAddress);
  }
}
