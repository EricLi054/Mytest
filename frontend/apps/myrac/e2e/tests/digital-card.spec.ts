import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { MembershipPage } from '../pages/MembershipPage';
import { RequestPlasticCardPage } from '../pages/RequestPlasticCardPage';

test.describe('Member request a new Plastic Card successfully', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const landingPage = new LandingPage(page);

    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    await loginPage.loginForDigitalCard();

    await landingPage.verifyLandingPage();
  });
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('verify digital card feature with inactive digital pass', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    const membershipPage = new MembershipPage(page);
    const requestPlasticCardPage = new RequestPlasticCardPage(page);
    await landingPage.verifyDigitalCardFeature();
    await landingPage.openProfilePage();
    await profilePage.verifyProfilePage();
    await profilePage.openMembershipPage();
    await membershipPage.verifyMembershipPage();
    await membershipPage.requestPlasticCard();
    await requestPlasticCardPage.verifyRequestPlasticCardPage();
  });
});

test.describe('Member check digital card with active digital pass', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const landingPage = new LandingPage(page);

    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    await loginPage.loginForDigitalCard();

    await landingPage.verifyDigitalCardWithDigitalPass();
  });
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('verify digital card feature with active digital pass', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    const membershipPage = new MembershipPage(page);
    const requestPlasticCardPage = new RequestPlasticCardPage(page);
    await landingPage.verifyDigitalCardFeature();
    await landingPage.openProfilePage();
    await profilePage.verifyProfilePage();
    await profilePage.openMembershipPage();
    await membershipPage.verifyMembershipPageWithActiveDigitalPass();
    await membershipPage.requestPlasticCard();
    await requestPlasticCardPage.verifyRequestPlasticCardPage();
  });
});
