import type { Page } from "@playwright/test";
import type { IdentificationMethodValue } from "#app/register/(register)/match/types/index.js";
import { expect } from "@playwright/test";
import { IdentificationMethod } from "#app/register/(register)/match/types/index.js";

import type { Member } from "../data";

export default class MatchPage {
  #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async verifyPageRendered(): Promise<void> {
    await expect(this.#page.getByRole("heading", { name: "To start, let's confirm your details" })).toBeVisible({
      timeout: 15000,
    });
  }

  async verifyNoMatchFound(): Promise<void> {
    await expect(this.#page.getByText("We couldn't find your details")).toBeVisible();
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. John").fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. Smith").fill(lastName);
  }

  async enterDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.#page.getByPlaceholder("dd / mm / yyyy").fill(dateOfBirth);
  }

  async enterAdditionalIdentifier(identificationMethod: IdentificationMethodValue, identifier: string) {
    switch (identificationMethod) {
      case IdentificationMethod.Mobile:
        await this.selectMobileIdentificationMethod();
        await this.enterMobileNumber(identifier);
        break;
      case IdentificationMethod.Membership:
        await this.selectMembershipIdentificationMethod();
        await this.enterMembershipNumber(identifier);
        break;
      case IdentificationMethod.Policy:
        await this.selectInsuranceIdentificationMethod();
        await this.enterPolicyNumber(identifier);
        break;
    }
  }

  async selectMobileIdentificationMethod(): Promise<void> {
    await this.#page.getByRole("radio", { name: "Mobile number identification method option" }).click();
  }

  async selectMembershipIdentificationMethod(): Promise<void> {
    await this.#page.getByRole("radio", { name: "Membership number identification method option" }).click();
  }

  async selectInsuranceIdentificationMethod(): Promise<void> {
    await this.#page.getByRole("radio", { name: "Insurance policy number identification method option" }).click();
  }

  async enterMobileNumber(mobileNumber: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. 0412345678").fill(mobileNumber);
  }

  async enterMembershipNumber(membershipNumber: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. 01-248815-4").fill(membershipNumber);
  }

  async enterPolicyNumber(policyNumber: string): Promise<void> {
    await this.#page.getByPlaceholder("e.g. MGP123456789").fill(policyNumber);
  }

  async submit(): Promise<void> {
    await this.#page.getByRole("button", { name: "Next" }).click();
  }

  async completePage(member: Member): Promise<void> {
    await this.verifyPageRendered();
    await this.enterFirstName(member.firstName);
    await this.enterLastName(member.lastName);
    await this.enterDateOfBirth(member.dateOfBirth);
    await this.enterAdditionalIdentifier(member.identificationMethod, member.identifier);
    await this.submit();
  }
}
