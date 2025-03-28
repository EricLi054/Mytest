import { expect, test } from "@playwright/test";

import { memberData, nonExistentMember } from "../data";
import Adb2cPage from "../pages/Adb2c";
import BeforeYouStartPage from "../pages/BeforeYouStart";
import ErrorPage from "../pages/Error";
import LinkMemberPage from "../pages/LinkMember";
import MatchPage from "../pages/Match";
import MyRacPage from "../pages/MyRac";
import { deleteAdb2cUser, getAdb2cAccessToken, getAdb2cUserByEmail } from "../utils/adb2c";
import { ADB2C_EMAIL } from "../utils/constants";

// Delete our test user before the test starts, in case a previous test didn't complete.
test.beforeEach(async ({ page }) => {
  const accessToken = await getAdb2cAccessToken();
  let userId = await getAdb2cUserByEmail(accessToken, ADB2C_EMAIL);

  if (userId !== "") {
    await deleteAdb2cUser(accessToken, userId);
    userId = await getAdb2cUserByEmail(accessToken, ADB2C_EMAIL);
  }

  expect(userId).toBe("");

  await page.goto("/identify/register");
});

// Delete the test user after each test
test.afterEach(async () => {
  const accessToken = await getAdb2cAccessToken();
  const userId = await getAdb2cUserByEmail(accessToken, ADB2C_EMAIL);

  if (userId !== "") {
    await deleteAdb2cUser(accessToken, userId);
  }
});

test.describe("Registration", () => {
  test("should successfully register a member", async ({ page }) => {
    const member = memberData;

    const beforeYouStartPage = new BeforeYouStartPage(page);
    await beforeYouStartPage.completePage();

    const matchPage = new MatchPage(page);
    await matchPage.completePage(member);

    const adb2cPage = new Adb2cPage(page);
    await adb2cPage.completePage();

    const linkMemberPage = new LinkMemberPage(page);
    await linkMemberPage.verifyPageRendered();

    const myRacPage = new MyRacPage(page);
    await myRacPage.verifyPageRendered();
  });

  test("should reject failed match after three attempts", async ({ page }) => {
    const member = nonExistentMember;
    const beforeYouStartPage = new BeforeYouStartPage(page);
    await beforeYouStartPage.completePage();

    const matchPage = new MatchPage(page);
    await matchPage.completePage(member);
    await matchPage.verifyNoMatchFound();
    await matchPage.completePage(member);
    await matchPage.verifyNoMatchFound();
    await matchPage.completePage(member);

    const errorPage = new ErrorPage(page);
    await errorPage.verifyCannotFindYou();
  });
});
