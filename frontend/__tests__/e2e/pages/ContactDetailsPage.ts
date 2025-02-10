import { expect, type Page } from '@playwright/test';
import { MFAOTP } from '../helpers/MFAOTP';

export class ContactDetailsPage {
  readonly page: Page;
  readonly profileLink;
  readonly contactDetailsHeadings;

  readonly nameSection;
  readonly memberName;
  readonly nameEditButton;

  readonly contactDetailsSection;
  readonly contactDetailsEditButton;
  readonly mobileNumber;
  readonly homeNumber;
  readonly workNumber;
  readonly contactEmail;
  readonly mailingAddress;

  readonly logInDetailsSection;
  readonly logInEmail;
  readonly logInPassword;
  readonly logInEditButton;

  readonly paymentDetailsSection;

  readonly mfaModalTitle;
  readonly FAQMessage;
  readonly callHelpCenterMessage;

  constructor(page: Page) {
    this.page = page;
    this.profileLink = this.page.locator('a[href="/myrac/profile"]:has([data-icon="chevron-left"])');
    this.contactDetailsHeadings = this.page.locator('h2:has-text("Your contact details")');    

    this.nameSection = this.page.locator('h3:has-text("Name")');
    this.memberName = this.page.locator('p[name="display"]');
    this.nameEditButton = this.page.locator('form').filter({hasText:'Name'}).getByRole('button');

    this.contactDetailsSection = this.page.locator('h3:has-text("Contact details")');
    this.contactDetailsEditButton = this.page.locator('form').filter({hasText:'Contact details'}).getByRole('button');
    this.mobileNumber = this.page.locator('p[name="mobile-display"]');
    this.homeNumber = this.page.locator('p[name="home-display"]');
    this.workNumber = this.page.locator('p[name="work-display"]');
    this.contactEmail = this.page.locator('p[name="email-display"]');
    this.mailingAddress = this.page.locator('p[name="address-display"]');

    this.logInDetailsSection = this.page.locator('h3:has-text("Log-in details")');
    this.logInEmail = this.page.locator('form').filter({hasText:'Log-in details'}).locator('h6:has-text("@u8pbw776.mailosaur.net")');
    this.logInPassword = this.page.locator('form').filter({hasText:'Log-in details'}).locator('h6:has-text("**********")');
    this.logInEditButton = this.page.locator('form').filter({ hasText: 'Log-in details' }).getByRole('link').first();

    this.paymentDetailsSection = this.page.locator('h3:has-text("Payment details")');

    this.mfaModalTitle = this.page.locator('#mfa-modal-title');
    this.FAQMessage = this.page.locator('p:has-text("Need help? Visit our FAQs")');
    this.callHelpCenterMessage = this.page.locator('p:has-text("Not your number? Call 13 17 03")');
  }

  async editContactDetails() {
    await this.clickRandomEditButton();
    await this.verifyMFAModal();
  }

  // TODO: Move to common helper
  async clickRandomEditButton() {
    const buttons = [this.nameEditButton, this.contactDetailsEditButton, this.logInEditButton];
    const randomIndex = Math.floor(Math.random() * buttons.length);
    await buttons[randomIndex].click();
  }

  async verifyMFAModal() {
    await expect(this.mfaModalTitle).toHaveText("Let’s verify it’s you");
    await expect(this.FAQMessage).toBeVisible();
    await expect(this.callHelpCenterMessage).toBeVisible();
    await MFAOTP.verifyOTP(this.page);

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
    await expect(this.contactDetailsHeadings).toBeVisible();
    await expect(this.profileLink).toBeVisible();

    await expect(this.nameSection).toBeVisible();
    await expect(this.memberName).toBeVisible();
    await expect(this.nameEditButton).toBeVisible();

    await expect(this.contactDetailsSection).toBeVisible();
    await expect(this.contactDetailsEditButton).toBeVisible();
    await this.verifyMaskedMobileNumber();
    await this.verifyNotProvidedPhoneNumber();
    await this.verifyContactEmail();
    await this.verifyMailingAddress();

    await expect(this.logInDetailsSection).toBeVisible();
    await expect(this.logInEmail).toBeVisible();
    await expect(this.logInPassword).toBeVisible();
    await expect(this.logInEditButton).toBeVisible();

    await expect(this.paymentDetailsSection).toBeVisible();
    await this.verifyPaymentSteps();
  }

  async verifyMaskedMobileNumber() {
    await expect(this.mobileNumber).toBeVisible();

    const mobileNumberText = await this.mobileNumber.textContent();
    const maskedMobileNumberPattern = /^04\*\* \*\*\* \d{3}$/;

    expect(mobileNumberText).toMatch(maskedMobileNumberPattern);
  }

  async verifyNotProvidedPhoneNumber() {
    const phoneNumbers = [
      this.mobileNumber,
      this.homeNumber,
      this.workNumber
    ];
  
    for (const phoneNumber of phoneNumbers) {
      const phoneNumberText = await phoneNumber.textContent();
      const containsDigits = phoneNumberText ? /\d/.test(phoneNumberText) : false;
  
      if (!containsDigits) {
        await expect(phoneNumber).toHaveText('Not Provided');
      }
    }
  }

  async verifyContactEmail() {
    await expect(this.contactEmail).toBeVisible();
  
    const contactEmailText = await this.contactEmail.textContent();
    const emailPattern = /^.\*{10}.*$/;
  
    expect(contactEmailText).toMatch(emailPattern);
  }
  
  async verifyMailingAddress() {
    await expect(this.mailingAddress).toBeVisible();
  
    const mailingAddressText = await this.mailingAddress.textContent();
    const addressPattern = /^\*\*.*$/; 
  
    expect(mailingAddressText).toMatch(addressPattern);
  }

  async verifyPaymentSteps() {
    const paymentSteps = [
      "1. Go to myRAC homepage.",
      "2. Select the item you'd like to update.",
      "3. Select 'Manage'.",
    ];
  
    for (const step of paymentSteps) {
      const stepLocator = this.page.locator(`p:has-text("${step}")`);
      await expect(stepLocator).toBeVisible();
    }
  }
}
