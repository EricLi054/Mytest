import { expect } from "@playwright/test";
import { logIntoMyRac } from "@racwa/automation";
import { test } from "../fixtures";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page, account }) => {
    await logIntoMyRac({ account, page });
    await expect(page).toHaveURL(/.*\/myrac/);
  });
});