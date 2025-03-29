import { expect } from "@playwright/test";
import { linkPerson, logIntoMyRac, secondsTaken } from "@racwa/automation";
import { test } from "../fixtures";
import { myracUrl, urls } from "../playwright-helpers/urls";
import { findDynamicsProduct } from "../utils/findDynamicsProduct";

const setup = async ({ account }: { account: MyRacAccount }) => {
  const start = performance.now();

  const classicProduct = await findDynamicsProduct({ productStatus: "Active", productType: "Classic" });
  const linkResult = await linkPerson({ crmId: classicProduct._rac_personid_value, email: account.email });

  if (!linkResult.success) {
    console.log(linkResult.error);
    throw new Error("Failed to link test data owner to myRac account");
  }

  console.log(`[setup]: Took ${secondsTaken(start)}s`);

  return { classicProduct };
};

test.describe("Authentication", () => {
  test("should login successfully and redirect to myrac", async ({ page, account }) => {
    await setup({ account });
    await page.goto(urls.landing);
    await logIntoMyRac({ account, page });
    await expect(page).toHaveURL(myracUrl("/"));
  });

  test("should be able to access profile page after login", async ({ page, account }) => {
    await setup({ account });
    await page.goto(urls.landing);
    await logIntoMyRac({ account, page });
    await page.goto(myracUrl("/profile"));
    await expect(page).toHaveURL(myracUrl("/profile"));
  });

  test("should be able to access contact details after login", async ({ page, account }) => {
    await setup({ account });
    await page.goto(urls.landing);
    await logIntoMyRac({ account, page });
    await page.goto(myracUrl("/your-contact-details"));
    await expect(page).toHaveURL(myracUrl("/your-contact-details"));
  });

  test("should be able to access membership page after login", async ({ page, account }) => {
    await setup({ account });
    await page.goto(urls.landing);
    await logIntoMyRac({ account, page });
    await page.goto(myracUrl("/membership"));
    await expect(page).toHaveURL(myracUrl("/membership"));
  });
});