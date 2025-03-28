import { test as base } from "@playwright/test";

import type { MyRacAccount } from "@racwa/automation";
import { createAccount, deleteAccount, getAccount, getKeyvaultSecret } from "@racwa/automation";

type Fixtures = {
  account: MyRacAccount;
};

export const test = base.extend<Fixtures>({
  account: async ({}, use) => {
    const log = (message: string) => console.log(`[account (Fixture)]: ${message}`);

    const passwordResult = await getKeyvaultSecret("MOTORING-E2E-ACCOUNT-PASSWORD");

    if (!passwordResult.success) {
      console.log(passwordResult.error);
      throw new Error("Failed to get password for account");
    }

    const randomId = crypto.randomUUID().replaceAll("-", "");

    const account = {
      email: `myrac-e2e-${randomId}@ytrlm97h.mailosaur.net`,
      password: passwordResult.secret,
    } as const satisfies MyRacAccount;

    const existingAccountResult = await getAccount(account);

    if (existingAccountResult.success) {
      throw new Error(`Account with email [${account.email}] already exists`);
    }

    const createAccountResult = await createAccount(account);

    if (!createAccountResult.success) {
      console.log(createAccountResult.error);
      throw new Error(`Failed to create account with email [${account.email}]`);
    }

    log(`Created new account with email [${account.email}]`);

    await use(account);

    const deleteAccountResult = await deleteAccount(account);

    if (!deleteAccountResult.success) {
      throw new Error(`Failed to delete account with email [${account.email}]`);
    }

    log(`Deleted account with email [${account.email}]`);
  },
});