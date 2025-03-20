import { test } from "e2e/fixtures";
import { findDynamicsProduct } from "e2e/roadside-assistance/utils/findDynamicsProduct";
import { roadsideAssistanceUrl } from "e2e/roadside-assistance/utils/roadsideAssistanceUrl";

import type { MyRacAccount } from "@racwa/automation";
import { getScreenshotDir, linkPerson, logIntoMyRac, secondsTaken, takeScreenshot } from "@racwa/automation";

import { SystemUnavailablePage } from "../pages/SystemUnavailablePage";

const setup = async ({ account }: { account: MyRacAccount }) => {
  const start = performance.now();

  const rewardsProduct = await findDynamicsProduct({ productStatus: "Active", productType: "RewardsMembership" });
  const linkResult = await linkPerson({ crmId: rewardsProduct._rac_personid_value, email: account.email });

  if (!linkResult.success) {
    console.log(linkResult.error);
    throw new Error("Failed to link test data owner to myRac account");
  }

  console.log(`[setup]: Took ${secondsTaken(start)}s`);

  return { rewardsProduct };
};

test.afterEach(async ({ page }) => {
  await takeScreenshot({ page, dirPath: getScreenshotDir(), filename: "Scenario End State.png" });
});

test("Product without roadside assistance should be redirected to system-unavailable", async ({ page, account }) => {
  const { rewardsProduct } = await setup({ account });

  await page.goto(
    roadsideAssistanceUrl(
      `/update-your-vehicle?productHoldingHeaderId=${rewardsProduct.rac_productholdingheaderid}&productHoldingLineId=${rewardsProduct.rac_policynumber}`,
    ),
  );

  await logIntoMyRac({ account, page });

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/system-unavailable"));

  const systemUnavailablePage = new SystemUnavailablePage({ page });
  await systemUnavailablePage.expectStaticContentToBeVisible();
  await systemUnavailablePage.takeScreenshot({ filename: "Form Load.png" });
});
