import { expect, test } from "@playwright/test";

import { createAuthPage } from "../pages/auth.page";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page }) => {
    const authPage = createAuthPage(page);
    await authPage.login();

    await expect(page).toHaveURL(/.*\/myrac/);
  });

  test("should login successfully with custom credentials", async ({ page }) => {
    const authPage = createAuthPage(page);
    await authPage.login("CUSTOM_USER", "CUSTOM_PASSWORD");

    await expect(page).toHaveURL(/.*\/myrac/);
  });
});
