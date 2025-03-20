import { AUTOMATION_ENV } from "e2e/env";
import { test } from "e2e/fixtures";
import { roadsideAssistanceUrl } from "e2e/roadside-assistance/utils/roadsideAssistanceUrl";

import type { MyRacAccount } from "@racwa/automation";
import {
  getScreenshotDir,
  linkPerson,
  logIntoMyRac,
  secondsTaken,
  takeScreenshot,
  unlinkPeson,
} from "@racwa/automation";

import type { VehicleColour, VehicleRego } from "../../types";
import { findProductEligibleForVehicleChange } from "../../utils/findProductEligibleForVehicleChange";
import { ChangeAlreadyMadePage } from "../pages/ChangeAlreadyMadePage";
import { ConfirmationPage } from "../pages/ConfirmationPage";
import { ConfirmVehiclePage } from "../pages/ConfirmVehiclePage";
import { UpdateVehiclePage } from "../pages/UpdateVehiclePage";
import { YourVehiclePage } from "../pages/YourVehiclePage";

const setup = async ({ account }: { account: MyRacAccount }) => {
  const start = performance.now();

  await unlinkPeson(account);
  const productResult = await findProductEligibleForVehicleChange();

  if (!productResult.success) {
    throw new Error("Failed to find roadside product for test");
  }

  const { owner } = productResult;

  const linkResult = await linkPerson({ crmId: owner.PersonId, email: account.email });

  if (!linkResult.success) {
    console.log(linkResult.error);
    throw new Error("Failed to link test data owner to myRac account");
  }

  console.log(`[setup]: Took ${secondsTaken(start)}s`);

  return { ...productResult };
};

test.afterEach(async ({ page }) => {
  await takeScreenshot({ page, dirPath: getScreenshotDir(), filename: "Scenario End State.png" });
});

test("Valid roadside product should be able to update vehicle once", async ({ page, account }) => {
  const { productHoldingHeader, productHoldingLine, owner } = await setup({ account });

  const entryUrl = roadsideAssistanceUrl(
    `/update-your-vehicle?productHoldingHeaderId=${productHoldingHeader.ProductHoldingHeaderId}&productHoldingLineId=${productHoldingLine.ProductHoldingId}`,
  );

  await page.goto(entryUrl);

  await logIntoMyRac({ account, page });

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/your-vehicle"));

  const yourVehiclePage = new YourVehiclePage({ page });
  await yourVehiclePage.selectIsVehicleBrokenDown("No");
  await yourVehiclePage.selectVehicleUse("Private use");
  await yourVehiclePage.takeScreenshot({ filename: "Form Complete.png" });
  await yourVehiclePage.submit();

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/update-vehicle"));

  const vehicleRego = "MOCK101" satisfies VehicleRego;
  const vehicleColour = "Black" satisfies VehicleColour;

  const updateVehiclePage = new UpdateVehiclePage({ page });
  await updateVehiclePage.selectTypeOfVehicle("Car");
  await updateVehiclePage.searchForVehicle(vehicleRego);
  await updateVehiclePage.confirmVehicle();
  await updateVehiclePage.selectColour(vehicleColour);
  await updateVehiclePage.takeScreenshot({ filename: "Form Complete.png" });
  await updateVehiclePage.submit();

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/confirm-vehicle"));

  const confirmVehiclePage = new ConfirmVehiclePage({ page });
  await confirmVehiclePage.expectStaticContentToBeVisible({ rego: vehicleRego, colour: vehicleColour });
  await confirmVehiclePage.takeScreenshot({ filename: "Form Complete.png" });
  test.skip(
    AUTOMATION_ENV === "local" || AUTOMATION_ENV === "dev",
    "Only 1 vehicle update is allowed per year per product, don't waste these on lower environments",
  );
  await confirmVehiclePage.submit();

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/confirmation"));

  const confirmationPage = new ConfirmationPage({ page });
  await confirmationPage.expectStaticContentToBeVisible({ firstName: owner.FirstName ?? "Owner is missing FirstName" });
  await confirmationPage.takeScreenshot({ filename: "Form Complete.png" });

  await page.goto(entryUrl);

  await page.waitForURL(roadsideAssistanceUrl("/update-your-vehicle/change-already-made"));

  const changeAlreadyMadePage = new ChangeAlreadyMadePage({ page });
  await changeAlreadyMadePage.expectStaticContentToBeVisible();
  await changeAlreadyMadePage.takeScreenshot({ filename: "Page Load.png" });
});
