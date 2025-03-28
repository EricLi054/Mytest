import { expect } from "@playwright/test";
import { logIntoMyRac } from "@racwa/automation";
import { test } from "../fixtures";
import { urls } from "../playwright-helpers/urls";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page, account }) => {
    await page.goto(urls.landing);
    await logIntoMyRac({ account, page });
    await expect(page).toHaveURL(urls.myrac);
  });
});