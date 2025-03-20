import { test } from "e2e/fixtures";
import { findDynamicsProduct } from "e2e/roadside-assistance/utils/findDynamicsProduct";
import { roadsideAssistanceUrl } from "e2e/roadside-assistance/utils/roadsideAssistanceUrl";

import type { MyRacAccount } from "@racwa/automation";
import { getScreenshotDir, linkPerson, logIntoMyRac, secondsTaken, takeScreenshot } from "@racwa/automation";

import { ProductUpdateNotAllowedPage } from "../pages/ProductUpdateNotAllowedPage";

const setup = async ({ account }: { account: MyRacAccount }) => {
  const start = performance.now();

  const dealershipProduct = await findDynamicsProduct({
    productStatus: "Active",
    productType: "MitsubishiCMOStandard",
  });
  const linkResult = await linkPerson({ crmId: dealershipProduct._rac_personid_value, email: account.email });

  if (!linkResult.success) {
    console.log(linkResult.error);
    throw new Error("Failed to link test data owner to myRac account");
  }

  console.log(`[setup]: Took ${secondsTaken(start)}s`);

  return { dealershipProduct };
};

test.afterEach(async ({ page }) => {
  await takeScreenshot({ page, dirPath: getScreenshotDir(), filename: "Scenario End State.png" });
});

test("Roadside product with rego only change allowed should be redirected to product-update-not-allowed", async ({
  page,
  account,
}) => {
  const { dealershipProduct } = await setup({ account });

  await page.goto(
    roadsideAssistanceUrl(
      `/update-your-vehicle?productHoldingHeaderId=${dealershipProduct.rac_productholdingheaderid}&productHoldingLineId=${dealershipProduct.rac_policynumber}`,
    ),
  );

  await logIntoMyRac({ account, page });

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/product-update-not-allowed"));

  const productUpdateNotAllowedPage = new ProductUpdateNotAllowedPage({ page });
  await productUpdateNotAllowedPage.expectStaticContentToBeVisible();
  await productUpdateNotAllowedPage.takeScreenshot({ filename: "Form Load.png" });
});
